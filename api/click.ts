let total = 1_000_000 + Math.floor(Date.now() / 86_400_000) * 97;

export async function POST() {
  total += 1;
  return Response.json(
    {
      total,
      note: "Everyone, everywhere, all at once. Approximately.",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function GET() {
  return Response.json({ total });
}
