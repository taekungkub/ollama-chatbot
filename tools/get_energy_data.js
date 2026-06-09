// ตัวอย่างประโยคที่ trigger tool นี้:
//   "ดูข้อมูล kwh ตั้งแต่ 1 มกราคม ถึง 31 มกราคม 2026"
//   "ช่วยดึง kva ของเดือนที่แล้วให้หน่อย"
//   "พลังงาน kvar ระหว่างวันที่ 2026-03-01 ถึง 2026-03-31 เป็นเท่าไหร่"
export const definition = {
  type: "function",
  function: {
    name: "get_energy_data",
    description:
      "ดึงข้อมูลการใช้พลังงานในช่วงวันที่กำหนด หาก user ไม่ได้ระบุประเภทพลังงาน (kwh/kvar/kva) ชัดเจน ให้ถามกลับแทนการเดา",
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
          description:
            "ประเภทของการวัดพลังงาน ต้องเป็นค่าใดค่าหนึ่งใน kwh, kvar, kva เท่านั้น ห้ามเดาหรือแปลงจากคำที่ไม่ชัดเจน",
        },
      },
      required: ["startDate", "endDate", "value"],
    },
  },
};

function generateMockData(startDate, endDate, value) {
  const units = { kwh: "kWh", kvar: "kVAR", kva: "kVA" };
  const ranges = { kwh: [120, 380], kvar: [30, 90], kva: [150, 400] };

  const data = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  const [min, max] = ranges[value];

  while (current <= end) {
    data.push({
      date: current.toISOString().slice(0, 10),
      value: parseFloat((Math.random() * (max - min) + min).toFixed(2)),
      unit: units[value],
    });
    current.setDate(current.getDate() + 1);
  }

  return data;
}

const VALID_VALUES = ["kwh", "kvar", "kva"];

// export async function execute({ startDate, endDate, value }) {
//   if (!VALID_VALUES.includes(value)) {
//     return JSON.stringify({
//       error: `ประเภทพลังงาน "${value}" ไม่ถูกต้อง กรุณาระบุเป็น: ${VALID_VALUES.join(", ")}`,
//     });
//   }

//   const data = generateMockData(startDate, endDate, value);
//   const total = data.reduce((sum, d) => sum + d.value, 0);

//   return JSON.stringify({
//     startDate,
//     endDate,
//     value,
//     unit: data[0]?.unit,
//     totalDays: data.length,
//     total: parseFloat(total.toFixed(2)),
//     average: parseFloat((total / data.length).toFixed(2)),
//     data,
//   });
// }

export async function execute({ startDate, endDate, value }) {
  if (!VALID_VALUES.includes(value)) {
    return JSON.stringify({
      error: `ประเภทพลังงาน "${value}" ไม่ถูกต้อง กรุณาระบุเป็น: ${VALID_VALUES.join(", ")}`,
    });
  }

  const data = generateMockData(startDate, endDate, value);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const average = total / data.length;
  const unit = data[0]?.unit;

  return `จากผลการค้นหา วันที่ ${startDate} ถึงวันที่ ${endDate} ของ ${value.toUpperCase()} (${unit}) พบว่า ค่าสูงสุดคือ ${max.toFixed(2)} ค่าต่ำสุดคือ ${min.toFixed(2)} ค่าเฉลี่ยคือ ${average.toFixed(2)} และยอดรวมทั้งหมดคือ ${total.toFixed(2)} ${unit}`;
}
