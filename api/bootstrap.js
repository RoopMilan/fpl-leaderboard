export default async function handler(req, res) {
  try {
    const response = await fetch("https://fantasy.premierleague.com/api/bootstrap-static/");
    if (!response.ok) {
      return res.status(500).json({ error: "Failed to fetch FPL data" });
    }
    const data = await response.json();
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}