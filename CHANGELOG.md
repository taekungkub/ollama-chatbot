# Changelog

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
