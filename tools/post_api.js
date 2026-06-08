import fetch from "node-fetch";

export const definition = {
  type: "function",
  function: {
    name: "post_api",
    description: "เรียก HTTP POST request พร้อม JSON body",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL ที่ต้องการ POST" },
        body: { type: "object", description: "JSON body ที่จะส่งไป" },
        headers: { type: "object", description: "HTTP headers เพิ่มเติม (optional)" },
      },
      required: ["url", "body"],
    },
  },
};

export async function execute(args) {
  const res = await fetch(args.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(args.headers || {}) },
    body: JSON.stringify(args.body),
  });
  const text = await res.text();
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}
