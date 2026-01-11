export default async () => {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore("schedule");

  const result = await store.get("latest.png", { type: "arrayBuffer", metadata: true });

  if (!result || !result.data) {
    return new Response("No image yet", { status: 404 });
  }

  return new Response(result.data, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "no-store",
      "X-Updated-At": result.metadata?.uploadedAt || ""
    }
  });
};
