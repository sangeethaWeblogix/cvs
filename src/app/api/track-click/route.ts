const API_KEY = process.env.MFS_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;

export async function POST(req: Request) {
  try {
    const { slug } = await req.json();
    if (!slug) return Response.json({ success: false });

    // Forward the real visitor's IP/User-Agent — otherwise the backend logs
    // this server's own connection info (e.g. browser: "node") for every hit.
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "";
    const userAgent = req.headers.get("user-agent") || "";

    await fetch(`${API_BASE}/click?slug=${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: {
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
        ...(ip && { "X-Forwarded-For": ip, "X-Real-IP": ip }),
        ...(userAgent && { "User-Agent": userAgent }),
      },
    });

    return Response.json({ success: true });
  } catch (_e) {
    return Response.json({ success: false });
  }
}
