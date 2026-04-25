// app/api/waitlist/route.ts
//
// Robust Klaviyo subscriber endpoint. Goals:
//   1. Never silently lose an email — every attempt is logged with
//      its outcome to the server console so signups are recoverable
//      from Vercel logs even if Klaviyo is down.
//   2. Surface real Klaviyo errors to the client so issues are
//      diagnosable (instead of an opaque 502).
//   3. Retry once on 5xx / network errors before giving up.

const KLAVIYO_URL =
  "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/";
const KLAVIYO_REVISION = "2024-10-15";

type SignupOutcome =
  | { status: "ok"; klaviyoStatus: number }
  | { status: "klaviyo_error"; klaviyoStatus: number; body: string }
  | { status: "network_error"; error: string }
  | { status: "missing_env" };

function logSignup(
  email: string,
  outcome: SignupOutcome,
  ip: string | null,
) {
  // Console log goes to Vercel runtime logs — every email captured
  // even if Klaviyo never accepted it.
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      tag: "[waitlist]",
      at: new Date().toISOString(),
      email,
      ip,
      outcome,
    }),
  );
}

async function postToKlaviyo(
  email: string,
  apiKey: string,
  listId: string,
): Promise<Response> {
  return fetch(KLAVIYO_URL, {
    method: "POST",
    headers: {
      Authorization: `Klaviyo-API-Key ${apiKey}`,
      "Content-Type": "application/json",
      revision: KLAVIYO_REVISION,
    },
    body: JSON.stringify({
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email,
                  subscriptions: {
                    email: { marketing: { consent: "SUBSCRIBED" } },
                  },
                },
              },
            ],
          },
          historical_import: false,
        },
        relationships: {
          list: { data: { type: "list", id: listId } },
        },
      },
    }),
  });
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    null;

  let payload: { email?: unknown; consent?: unknown };
  try {
    payload = await req.json();
  } catch {
    return Response.json(
      { error: "invalid_json" },
      { status: 400 },
    );
  }

  const { email, consent } = payload;

  if (consent !== true) {
    return Response.json({ error: "consent_required" }, { status: 400 });
  }
  if (
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.KLAVIYO_PRIVATE_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  // Env-var guard. Without these, Klaviyo will 401 and we'd return
  // a vague 502. Catch it up front and tell the operator clearly.
  if (!apiKey || !listId) {
    logSignup(email, { status: "missing_env" }, ip);
    return Response.json(
      {
        error: "server_misconfigured",
        detail:
          "KLAVIYO_PRIVATE_KEY and/or KLAVIYO_LIST_ID env vars are not set on this deployment.",
      },
      { status: 500 },
    );
  }

  // Try Klaviyo. One retry on 5xx / network error.
  let lastResponse: Response | null = null;
  let lastNetworkError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await postToKlaviyo(email, apiKey, listId);
      lastResponse = res;
      if (res.ok) {
        logSignup(email, { status: "ok", klaviyoStatus: res.status }, ip);
        return Response.json({ ok: true });
      }
      // 5xx → retry once. 4xx → bail (won't fix itself).
      if (res.status < 500 || attempt === 1) break;
    } catch (err) {
      lastNetworkError = err;
      if (attempt === 1) break;
    }
  }

  // All attempts exhausted.
  if (lastResponse) {
    const body = await lastResponse.text().catch(() => "<unreadable>");
    logSignup(
      email,
      {
        status: "klaviyo_error",
        klaviyoStatus: lastResponse.status,
        body,
      },
      ip,
    );
    return Response.json(
      {
        error: "klaviyo_rejected",
        klaviyoStatus: lastResponse.status,
        detail: body.slice(0, 500),
      },
      { status: 502 },
    );
  }

  const errMsg =
    lastNetworkError instanceof Error
      ? lastNetworkError.message
      : String(lastNetworkError);
  logSignup(email, { status: "network_error", error: errMsg }, ip);
  return Response.json(
    { error: "network_error", detail: errMsg.slice(0, 500) },
    { status: 502 },
  );
}
