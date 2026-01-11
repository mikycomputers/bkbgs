export default async () => {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("schedule");

    // מבקשים גם את הנתונים וגם את ה-metadata
    const result = await store.get("latest.png", {
      type: "arrayBuffer",
      metadata: true
    });

    if (!result || !result.data) {
      return new Response("No image yet", {
        status: 404,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store"
        }
      });
    }

    return new Response(result.data, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
        // זמן העדכון שנשמר בזמן ההעלאה
        "X-Updated-At": result.metadata?.uploadedAt || ""
      }
    });
  } catch (err) {
    return new Response(
      "Function error: " + err.message,
      {
        status: 500,
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store"
        }
      }
    );
  }
};
