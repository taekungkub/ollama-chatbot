export const definition = {
  type: "function",
  function: {
    name: "get_current_time",
    description: "ดึงวันเวลาปัจจุบัน",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
};

export async function execute(_args) {
  return new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
}
