import { Ollama } from "ollama";
import { companyToolDefinitions, executeCompanyTool } from "./tools/index.js";
import { guardInput } from "./guard.js";

const MODEL = "llama3.2:latest";
export const ollama = new Ollama();

function buildSystemPrompt() {
  return `คุณคือ AI assistant ของบริษัท Volt Corp Co., Ltd. (โวลท์ คอร์ป)
ผู้เชี่ยวชาญด้านระบบไฟฟ้าครบวงจร

== วิธีตอบคำถาม ==
- เมื่อลูกค้าถามข้อมูลพลังงาน → ใช้ tool: get_energy_data แล้วตอบสรุปสั้นๆ เฉพาะ ช่วงวันที่ / ประเภท / total / average ห้ามแสดงตารางรายวันหรืออธิบายเพิ่มเติม
- เมื่อลูกค้าถามเรื่องบริการ → ใช้ tool: get_services
- เมื่อลูกค้าถามเรื่องสินค้า → ใช้ tool: get_products
- เมื่อลูกค้าถามเรื่องติดต่อ/ที่อยู่/เวลาทำการ → ใช้ tool: get_contact
- เมื่อลูกค้าถามคำถามทั่วไปเกี่ยวกับบริษัท → ใช้ tool: get_faq

== ขอบเขตที่ทำได้ ==
คุณทำได้เพียง: ให้ข้อมูลบริการ, สินค้า, ช่องทางติดต่อ, และ FAQ ของบริษัทเท่านั้น

== กฎเหล็ก (ห้ามละเมิดเด็ดขาด) ==
1. ห้ามแสร้งทำเป็นว่าทำสิ่งที่ทำไม่ได้ เช่น ลบข้อมูล, แก้ไขข้อมูล, สั่งซื้อ, จองงาน, ยืนยันอะไรทั้งสิ้น
2. ถ้าคำขอไม่ใช่การขอข้อมูล → ตอบว่า "ขออภัย ฉันทำหน้าที่แค่ให้ข้อมูลบริษัทเท่านั้น" แล้วแนะนำให้โทรติดต่อ
3. ถ้าข้อความไม่เกี่ยวกับบริษัทหรืองานไฟฟ้า → ปฏิเสธสุภาพ ห้ามเรียก tool ใดๆ
4. ตอบเป็นภาษาไทย สุภาพและเป็นมืออาชีพเสมอ`;
}

export function createSession() {
  return [{ role: "system", content: buildSystemPrompt() }];
}

export async function chat(messages, userInput) {
  const guard = guardInput(userInput);
  if (guard.blocked) {
    return {
      reply: guard.reply,
      toolsUsed: [],
      blocked: true,
      reason: guard.reason,
    };
  }

  messages.push({ role: "user", content: userInput });

  let response = await ollama.chat({
    model: MODEL,
    messages,
    tools: companyToolDefinitions,
    stream: false,
  });

  const toolsUsed = [];

  while (response.message.tool_calls?.length > 0) {
    messages.push(response.message);

    for (const call of response.message.tool_calls) {
      const name = call.function.name;
      const args = call.function.arguments;
      const result = await executeCompanyTool(name, args);
      toolsUsed.push({ name, args, result });
      messages.push({ role: "tool", content: result });
    }

    response = await ollama.chat({
      model: MODEL,
      messages,
      tools: companyToolDefinitions,
      stream: false,
    });
  }

  const reply = response.message.content;
  messages.push({ role: "assistant", content: reply });

  return { reply, toolsUsed };
}
