import { getStore } from "@netlify/blobs";

export default async (request, context) => {
  try {
    const store = getStore({ name: "schedule", consistency: "strong" });

    const result = await store.getWithMetadata("latest.png", { type: "arrayBuffer" });

    if (!result || !result.data) {
      return new Response("No image yet", {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return new Response(result.data, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        "X-Updated-At": result.metadata?.uploadedAt || "",
      },
    });
  } catch (err) {
    return new Response("Edge function error: " + err.message, {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }
};
