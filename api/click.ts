type Store = { total: number };

const g = globalThis as unknown as { __press?: Store };

function memory(): Store {
  if (!g.__press) {
    g.__press = {
      total: 1_000_000 + Math.floor(Date.now() / 86_400_000) * 97,
    };
  }
  return g.__press;
}

async function readTotal(): Promise<number> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    try {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: "please-press", limit: 1 });
      const url = blobs[0]?.url;
      if (url) {
        const res = await fetch(url, { cache: "no-store" });
        const data = (await res.json()) as { total?: number };
        if (typeof data.total === "number") {
          memory().total = data.total;
          return data.total;
        }
      }
    } catch {
      /* Blob optional */
    }
  }
  return memory().total;
}

async function writeTotal(n: number): Promise<void> {
  memory().total = n;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    const { put } = await import("@vercel/blob");
    await put("please-press.json", JSON.stringify({ total: n }), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
  } catch {
    /* still counted in this isolate */
  }
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Cache-Control": "no-store",
};

export async function POST(): Promise<Response> {
  const total = (await readTotal()) + 1;
  await writeTotal(total);
  return Response.json(
    { total, note: "Everyone, everywhere, all at once. Approximately." },
    { headers },
  );
}

export async function GET(): Promise<Response> {
  return Response.json({ total: await readTotal() }, { headers });
}
