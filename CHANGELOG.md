# Changelog

## [2026-06-09] — เปลี่ยน tool response เป็น formatted string

### Changed
- `tools/get_energy_data.js` — execute() คืน Thai template string แทน JSON พร้อม max/min/average/total

---

## [2026-06-09] — จำกัด reply format ของ get_energy_data

### Changed
- `chat.js` — เพิ่ม instruction ใน system prompt ให้ตอบสรุปสั้นๆ เฉพาะ total/average ห้ามแสดงตารางรายวัน

---

## [2026-06-09] — แก้ model auto-correct enum ใน get_energy_data

### Changed
- `tools/get_energy_data.js` — เพิ่ม instruction ใน description ห้าม model เดาค่า value ให้ถามกลับถ้าไม่ชัดเจน

---

## [2026-06-09] — validate value ใน get_energy_data

### Changed
- `tools/get_energy_data.js` — เพิ่ม validation ตรวจสอบ value ก่อน execute พร้อม mock data รายวัน + total/average

---

## [2026-06-09] — mock data สำหรับ get_energy_data

### Changed
- `tools/get_energy_data.js` — เพิ่ม `generateMockData()` สร้างข้อมูลรายวันในช่วงวันที่กำหนด พร้อม total และ average แต่ละ unit (kwh/kvar/kva)

---

## [2026-06-09] — เพิ่ม example trigger comments ใน tools

### Changed
- `tools/get_energy_data.js` — เพิ่ม comment ตัวอย่างประโยคที่ trigger tool

---

## [2026-06-09] — สร้าง CLAUDE.md และ CHANGELOG.md

### Added
- `CLAUDE.md` — เพิ่มเอกสารโปรเจคสำหรับให้ Claude อ่านอัตโนมัติทุก session (แนวคิด, โครงสร้างไฟล์, กฎ changelog)
- `CHANGELOG.md` — สร้าง changelog สำหรับบันทึกการเปลี่ยนแปลง

---

## [2026-06-09] — เพิ่ม tool get_energy_data

### Added
- `tools/get_energy_data.js` — สร้าง tool ใหม่สำหรับดึงข้อมูลพลังงาน รับ parameter startDate, endDate, value (enum: kwh/kvar/kva) ทุกตัว required

### Changed
- `tools/index.js` — import และเพิ่ม getEnergyData เข้า companyTools
