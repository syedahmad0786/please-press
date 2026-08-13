let total = 1_000_000 + Math.floor(Date.now() / 86_400_000) * 97;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method === "POST") total += 1;
  res.status(200).json({
    total,
    note: "Everyone, everywhere, all at once. Approximately.",
  });
}
