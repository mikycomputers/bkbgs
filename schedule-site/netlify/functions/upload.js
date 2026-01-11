export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.imageBase64) {
    return new Response("Missing imageBase64", { status: 400 });
  }

  const b64 = body.imageBase64.replace(/^data:image\/\w+;base64,/, "");
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));

  const { getStore } = await import("@netlify/blobs");
  const store = getStore("schedule");
  await store.set("latest.jpg", bytes, {
    metadata: { uploadedAt: new Date().toISOString() }
  });

  return new Response("OK", { status: 200 });
};
