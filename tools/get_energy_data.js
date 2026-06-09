export const definition = {
  type: "function",
  function: {
    name: "get_energy_data",
    description: "ดึงข้อมูลการใช้พลังงานในช่วงวันที่กำหนด",
    parameters: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "วันที่เริ่มต้น รูปแบบ ISO 8601 เช่น 2026-01-01",
        },
        endDate: {
          type: "string",
          description: "วันที่สิ้นสุด รูปแบบ ISO 8601 เช่น 2026-01-31",
        },
        value: {
          type: "string",
          enum: ["kwh", "kvar", "kva"],
          description: "ประเภทของการวัดพลังงาน: kwh, kvar หรือ kva",
        },
      },
      required: ["startDate", "endDate", "value"],
    },
  },
};

export async function execute({ startDate, endDate, value }) {
  // TODO: replace with real data source
  return JSON.stringify({
    startDate,
    endDate,
    value,
    data: [],
  });
}
