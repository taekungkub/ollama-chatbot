# Ollama Chatbot — Volt Corp

Local AI chatbot สำหรับให้ข้อมูลบริษัท **Volt Corp** (ธุรกิจไฟฟ้า) โดยใช้ [Ollama](https://ollama.com) + `llama3.1` พร้อม tool calling

## Features

- **CLI mode** — แชทผ่าน terminal
- **API mode** — Express server รับ-ส่งผ่าน HTTP
- **Tool calling** — bot ดึงข้อมูลบริษัทผ่าน tools แทนการ hardcode
- **Input guard** — บล็อก action requests และคำถามนอกขอบเขตก่อนส่งให้ model

## Requirements

- [Node.js](https://nodejs.org) >= 18
- [Ollama](https://ollama.com) ติดตั้งและรันอยู่
- model `llama3.1:latest` ดาวน์โหลดแล้ว

```bash
ollama pull llama3.1
```

## Installation

```bash
git clone https://github.com/taekungkub/ollama-chatbot.git
cd ollama-chatbot
npm install
```

## Usage

### CLI Mode

```bash
npm start
```

| คำสั่ง | ทำอะไร |
|--------|--------|
| `exit` | ออกจากโปรแกรม |
| `clear` | ล้างประวัติการแชท |

### API Mode

```bash
npm run server
# → http://localhost:3000
```

#### Endpoints

| Method | Path | คำอธิบาย |
|--------|------|----------|
| `POST` | `/chat` | ส่งข้อความแชท |
| `DELETE` | `/chat/:sessionId` | ล้าง session |
| `GET` | `/company` | ดูข้อมูลบริษัท |
| `GET` | `/health` | health check |

#### ตัวอย่างเรียก API

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "มีบริการอะไรบ้าง?", "sessionId": "user1"}'
```

Response:
```json
{
  "reply": "Volt Corp มีบริการดังนี้...",
  "toolsUsed": [{ "name": "get_services", "args": {}, "result": "..." }],
  "sessionId": "user1"
}
```

## Project Structure

```
ollama-chatbot/
├── index.js          — CLI chatbot
├── server.js         — Express API server
├── chat.js           — shared chat logic + system prompt
├── guard.js          — input guard (บล็อกก่อนส่ง model)
├── data/
│   └── company.js    — ข้อมูล mock บริษัท Volt Corp
└── tools/
    ├── index.js          — tool registry
    ├── get_services.js   — ดึงรายการบริการ
    ├── get_products.js   — ดึงรายการสินค้า
    ├── get_contact.js    — ดึงข้อมูลติดต่อ
    ├── get_faq.js        — ดึง FAQ
    ├── fetch_api.js      — HTTP GET (CLI general)
    ├── post_api.js       — HTTP POST (CLI general)
    ├── calculate.js      — คำนวณ math
    └── get_current_time.js — เวลาปัจจุบัน
```

## Adding a New Tool

1. สร้างไฟล์ใหม่ใน `tools/` เช่น `tools/get_promotions.js`

```js
export const definition = {
  type: "function",
  function: {
    name: "get_promotions",
    description: "ดึงโปรโมชั่นปัจจุบัน",
    parameters: { type: "object", properties: {}, required: [] },
  },
};

export async function execute(_args) {
  return JSON.stringify([{ name: "ลด 10%", until: "2025-12-31" }]);
}
```

2. เพิ่ม import ใน `tools/index.js`

```js
import * as getPromotions from "./get_promotions.js";
const companyTools = [..., getPromotions];
```

## Input Guard

bot จะบล็อกและตอบปฏิเสธทันที (ไม่ผ่าน model) เมื่อพบ:
- **Action requests** — ลบ, แก้ไข, สั่งซื้อ, จอง, ยืนยัน
- **Off-topic** — การเมือง, หุ้น, โค้ด, ดูดวง, คำหยาบ

แก้ไข pattern ได้ที่ `guard.js`
