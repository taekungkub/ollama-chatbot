# CLAUDE.md — Volt Corp Ollama Chatbot

## แนวคิดโปรเจค

Chatbot สำหรับบริษัท **Volt Corp Co., Ltd.** ผู้เชี่ยวชาญระบบไฟฟ้าครบวงจร
รันบน **Ollama** (local LLM) โดยใช้ model `llama3.1:latest` ไม่พึ่ง cloud API

มี 2 โหมด:
- **CLI** (`npm start`) — ใช้งานผ่าน terminal โดยตรง
- **API** (`npm run server`) — Express server รับ HTTP request จาก client อื่น

Bot ทำได้แค่ **ให้ข้อมูลบริษัท** เท่านั้น ไม่รับคำสั่ง action ใดๆ (ลบ/แก้ไข/สั่งซื้อ)
มีระบบ guard กรอง input ก่อนส่งให้ model เสมอ

---

## โครงสร้างไฟล์

```
ollama-chatbot/
├── index.js              # CLI entrypoint — readline loop + chalk UI
├── server.js             # API entrypoint — Express, session map in-memory
├── chat.js               # core chat logic — ส่งไปยัง Ollama, จัดการ tool call loop
├── guard.js              # กรอง input ก่อนส่ง model (action / off-topic patterns)
├── tools/
│   ├── index.js          # รวม tool ทั้งหมด, แยก generalTools / companyTools
│   ├── get_services.js   # ดึงข้อมูลบริการ
│   ├── get_products.js   # ดึงข้อมูลสินค้า
│   ├── get_contact.js    # ดึงช่องทางติดต่อ
│   ├── get_faq.js        # ดึง FAQ
│   ├── get_energy_data.js# ดึงข้อมูลพลังงาน (kwh/kvar/kva) ตามช่วงวันที่
│   ├── fetch_api.js      # general tool — GET request
│   ├── post_api.js       # general tool — POST request
│   ├── calculate.js      # general tool — คำนวณ
│   └── get_current_time.js # general tool — เวลาปัจจุบัน
├── data/
│   └── company.js        # ข้อมูลบริษัท (static) — บริการ, สินค้า, ติดต่อ, FAQ
├── CHANGELOG.md          # บันทึกการเปลี่ยนแปลงทุก session
└── package.json          # ESM, scripts: start / server
```

---

## Pattern การเพิ่ม Tool ใหม่

1. สร้างไฟล์ `tools/<ชื่อ>.js` ที่มี `export const definition` และ `export async function execute(args)`
2. Import และเพิ่มเข้า array ที่ต้องการใน `tools/index.js` (`generalTools` หรือ `companyTools`)
3. ถ้า tool ใหม่เกี่ยวกับข้อมูลบริษัท → เพิ่มใน system prompt ใน `chat.js` ด้วย

Tool definition ใช้ format Ollama/OpenAI:
```js
export const definition = {
  type: "function",
  function: {
    name: "tool_name",
    description: "...",
    parameters: {
      type: "object",
      properties: { ... },
      required: ["field1", "field2"],
    },
  },
};
```

---

## กฎที่ต้องทำทุกครั้ง

- **บันทึก CHANGELOG.md ทุกครั้ง** ที่มีการสร้าง/แก้ไข/ลบไฟล์ใดๆ — บันทึกเป็น step สุดท้ายก่อนตอบ user เสมอ
  ใช้ format [Keep a Changelog](https://keepachangelog.com/) เพิ่ม entry ใหม่ไว้**ด้านบนสุด**

---

## Commands

```bash
npm start        # เปิด CLI chatbot
npm run server   # เปิด API server ที่ port 3000
```

API Endpoints:
- `POST /chat` — `{ message, sessionId? }`
- `DELETE /chat/:sessionId` — ล้าง session
- `GET /company` — ข้อมูลบริษัท
- `GET /health` — health check
