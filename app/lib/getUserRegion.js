export async function getUserRegion() {
  try {
    const res = await fetch("https://ipapi.co/json/", {
      cache: "no-store",
    });
    const data = await res.json();

    return {
      state: data?.region_code?.toLowerCase() || null,
      city: data?.city || null,
    };
  } catch {
    return { state: null, city: null };
  }
}// JavaScript Document