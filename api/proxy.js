export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    const response = await fetch(decodeURIComponent(url));
    const contentType = response.headers.get("content-type");
    const body = await response.text();

    res.setHeader("Content-Type", contentType || "application/json");
    res.status(response.status).send(body);
  } catch (error) {
    console.error("Proxy fetch failed:", error);
    res.status(500).json({ error: "Proxy fetch failed" });
  }
}
