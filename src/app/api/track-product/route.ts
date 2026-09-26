import { NextResponse } from "next/server";
import { readObfuscatedBody } from "@/lib/obfuscation";
const API_KEY = process.env.MFS_API_KEY;
const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;

// The product detail page's view tracker sends an obfuscated body — plain
// req.json() throws on that payload, silently failing every call below.
export async function POST(req: Request) {
  try {
    const { slug } = await readObfuscatedBody<{ slug?: string }>(req);
    if (!slug) return NextResponse.json({ success: false });

    // Forward the real visitor's IP/User-Agent — otherwise the backend logs
    // this server's own connection info (e.g. browser: "node") for every hit.
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "";
    const userAgent = req.headers.get("user-agent") || "";

    const headers = {
      ...(API_KEY && { "X-Secret-Key": API_KEY }),
      ...(ip && { "X-Forwarded-For": ip, "X-Real-IP": ip }),
      ...(userAgent && { "User-Agent": userAgent }),
    };

    await Promise.all([
      fetch(`${API_BASE}/click?slug=${encodeURIComponent(slug)}`, { method: "POST", headers }),
      fetch(`${API_BASE}/impression?slug=${encodeURIComponent(slug)}`, { method: "POST", headers }),
    ]);

    return NextResponse.json({ success: true });
  } catch (_e) {
    return NextResponse.json({ error: true });
  }
}
