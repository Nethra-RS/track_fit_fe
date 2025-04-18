import API_BASE_URL from "../lib/api";

export async function fetchSessionRaw() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("Session fetch failed");

    const data = await res.json();

    if (data?.user) {
      return { user: data.user, expires: data.expires };
    }

    return null;
  } catch {
    return null;
  }
}
