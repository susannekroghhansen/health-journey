// Same-origin proxy for Liv's AI calls.
// Your Anthropic API key lives here as an encrypted env var (ANTHROPIC_API_KEY),
// never in the browser. Cloudflare Access in front of the site keeps this private.
export async function onRequestPost({ request, env }) {
  try {
    const body = await request.text();
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body,
    });
    return new Response(await r.text(), {
      status: r.status,
      headers: { "content-type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "proxy_failed" }), {
      status: 502, headers: { "content-type": "application/json" },
    });
  }
}
export const onRequestGet = () => new Response("Liv proxy is alive.");
