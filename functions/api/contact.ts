type Env = {
  RESEND_API_KEY?: string;
  CONTACT_EMAIL_TO?: string;
  CONTACT_EMAIL_FROM?: string;
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
}

export async function onRequest({ request, env }: { request: Request; env: Env }) {
  if (request.method !== "POST") return json(405, { ok: false });
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) return json(403, { ok: false });
  if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) {
    return json(415, { ok: false });
  }
  if (Number(request.headers.get("Content-Length") || 0) > 16384) return json(413, { ok: false });
  let data: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 16384) return json(413, { ok: false });
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return json(400, { ok: false });
    data = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false });
  }
  const field = (key: string) => typeof data[key] === "string" ? data[key].trim() : "";
  if (field("website")) return json(400, { ok: false });
  const name = field("name"), phone = field("phone"), email = field("email");
  const message = field("message"), product = field("productName");
  if (!name || name.length > 120 || !phone || phone.length > 60 ||
      !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !message || message.length > 2000 || !product || product.length > 500 ||
      /[\r\n]/.test(name + phone + email + product)) {
    return json(400, { ok: false });
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_EMAIL_TO || !env.CONTACT_EMAIL_FROM) {
    console.error("Contact API: missing server configuration");
    return json(503, { ok: false });
  }
  const en = field("locale") === "en";
  const subject = `${en ? "Product inquiry" : "Запитване за продукт"}: ${product}`;
  const text = [
    `${en ? "Product" : "Продукт"}: ${product}`,
    `${en ? "Name" : "Име"}: ${name}`,
    `${en ? "Phone" : "Телефон"}: ${phone}`,
    `${en ? "Email" : "Имейл"}: ${email}`,
    "", message,
  ].join("\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.CONTACT_EMAIL_FROM, to: [env.CONTACT_EMAIL_TO], reply_to: email, subject, text }),
    });
    if (!response.ok) {
      // Do not log private form data, recipient addresses, or API credentials.
      console.error("Contact API: Resend returned", response.status);
      return json(502, { ok: false });
    }
    const result = await response.json() as { id?: string };
    if (!result.id) return json(502, { ok: false });
    return json(200, { ok: true });
  } catch {
    console.error("Contact API: delivery request failed");
    return json(502, { ok: false });
  }
}
