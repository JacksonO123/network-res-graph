Bun.serve({
  static: {
    "/": new Response(await Bun.file("public/index.html").bytes(), {
      headers: {
        "Content-Type": "text/html",
      },
    }),
    "/data": new Response(await Bun.file("data/times.json").bytes(), {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  },

  fetch() {
    return new Response("404");
  },
});
