export async function getLocationFromIP(ip: string) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    if (data && data.city && data.country_name) {
      return `${data.city},${data.country_name}`;
    }
    return "Unknown location";
  } catch (error) {
    console.error("Location lookup failed", error);
    return "Unknown location";
  }
}
