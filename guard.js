// คำที่บ่งบอกว่าต้องการให้ทำ action (ไม่ใช่แค่ขอข้อมูล)
const ACTION_PATTERNS = [
  /ลบ/,
  /แก้ไข|อัปเดต|เปลี่ยน|แก้/,
  /สั่งซื้อ|สั่ง|ซื้อ/,
  /จอง/,
  /ยืนยัน|อนุมัติ/,
  /ส่ง(ข้อมูล|อีเมล|ไฟล์)/,
  /บันทึก|เพิ่มข้อมูล/,
  /รีเซ็ต|reset/i,
  /hack|เจาะ|โจมตี/,
];

// คำที่ไม่เกี่ยวกับบริษัทหรืองานไฟฟ้าเลย
const OFF_TOPIC_PATTERNS = [
  /การเมือง|รัฐบาล|นายก|พรรค/,
  /หุ้น|ลงทุน|crypto|bitcoin/i,
  /ทำการบ้าน|แบบฝึกหัด/,
  /เขียนโค้ด|debug|โปรแกรม/,
  /สูตรอาหาร|ทำกับข้าว/,
  /ดูดวง|โหราศาสตร์/,
  /ด่า|ไอ้|ไอสัส|ไอ้สัตว์|อีสัส|มึง|กู|แม่ง|ควย|สัตว์/,
];

export function guardInput(input) {
  const text = input.trim();

  for (const pattern of ACTION_PATTERNS) {
    if (pattern.test(text)) {
      return {
        blocked: true,
        reason: "action",
        reply:
          "ขออภัยครับ ฉันทำหน้าที่ให้ข้อมูลเท่านั้น ไม่สามารถดำเนินการแก้ไข ลบ หรือสั่งการใดๆ ได้ หากต้องการติดต่อทีมงาน กรุณาโทร 02-123-4567 ครับ",
      };
    }
  }

  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(text)) {
      return {
        blocked: true,
        reason: "off_topic",
        reply:
          "ขออภัยครับ ฉันตอบได้เฉพาะเรื่องบริการและสินค้าของ Volt Corp เท่านั้น มีอะไรเกี่ยวกับระบบไฟฟ้าให้ช่วยไหมครับ?",
      };
    }
  }

  return { blocked: false };
}
