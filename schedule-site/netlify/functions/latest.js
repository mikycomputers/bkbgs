export default async () => {
  const { getStore } = await import("@netlify/blobs");
  const store = getStore("schedule");
  const data = await store.get("latest.jpg", { type: "arrayBuffer" });

  if (!data) {
    return new Response("No image yet", { status: 404 });
  }

  return new Response(data, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "no-store"
    }
  });
};
