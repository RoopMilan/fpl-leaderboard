
export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const fetchRes = await fetch(decodeURIComponent(url));
    const data = await fetchRes.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Proxy fetch failed:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
