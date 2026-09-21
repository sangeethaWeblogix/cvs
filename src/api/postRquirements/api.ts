// src/api/requirements/api.ts
const API_BASE = process.env.NEXT_PUBLIC_MFS_API_BASE;
const API_KEY = process.env.MFS_API_KEY; // ✅ Add this

export type Requirement = {
  id?: number; // if the API returns one
  featured?: "0" | "1";
  type: string; // e.g., "Hybrid"
  condition: string; // e.g., "Used" | "New"
  location: string; // e.g., "2033"
  requirements: string; // text
  budget: string; // number as string
  active?: "0" | "1";
  created_at?: string;
};

type ListResp = {
  success: boolean;
  data: Requirement[]; // screenshot shows an array under data
};

export async function fetchRequirements(): Promise<Requirement[]> {
  if (!API_BASE) return [];
  const url = `${API_BASE}/get-home-enquiries-list`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: {
        Accept: "application/json",
        ...(API_KEY && { "X-Secret-Key": API_KEY }),
      },
    });
    if (!res.ok) return [];
    const json: ListResp = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
}

export type HomeEnquiryPayload = {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  condition: string;
  budget: string;
  requirements: string;
};

export type HomeEnquiryResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

// POST counterpart to fetchRequirements' get-home-enquiries-list — submits
// the /campervan-enquiry-form/ page's form. Routed through /api/home-enquiry/
// (not straight to API_BASE) because this is called from a client component,
// where MFS_API_KEY (no NEXT_PUBLIC_ prefix) is never bundled to the browser —
// the internal route runs server-side and attaches the real key instead.
export async function createHomeEnquiry(
  payload: HomeEnquiryPayload
): Promise<HomeEnquiryResponse> {
  const res = await fetch(`/api/home-enquiry/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const raw = await res.text();
  let json: HomeEnquiryResponse;
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    json = { message: raw || "Invalid JSON from server" };
  }

  if (!res.ok) {
    throw new Error(json.message || "Enquiry submission failed");
  }

  return json;
}

 