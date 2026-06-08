import fetch from "node-fetch";

export const definition = {
  type: "function",
  function: {
    name: "fetch_api",
    description: "เรียก HTTP GET request ไปยัง URL ที่กำหนด แล้ว return ผลลัพธ์ JSON หรือ text",
    parameters: {
      type: "object",
      properties: {
        url: { type: "string", description: "URL ที่ต้องการเรียก" },
        headers: { type: "object", description: "HTTP headers เพิ่มเติม (optional)" },
      },
      required: ["url"],
    },
  },
};

export async function execute(args) {
  const res = await fetch(args.url, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...(args.headers || {}) },
  });
  const text = await res.text();
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}
