---
name: changelog-tracker
description: >
  บันทึกการเปลี่ยนแปลงทั้งหมดที่ agent ทำลงใน CHANGELOG.md ทุกครั้งที่มีการแก้ไขไฟล์ เขียนโค้ด สร้างไฟล์ใหม่ ลบไฟล์ รัน command ที่ส่งผลต่อ codebase หรือเปลี่ยนแปลง config ใดๆ ใช้ skill นี้ทุกครั้งที่ agent ได้รับคำสั่งให้ทำงานกับไฟล์หรือ codebase แม้ user จะไม่ได้พูดถึง "changelog" หรือ "บันทึก" ก็ตาม — การบันทึกควรเกิดขึ้น **อัตโนมัติ** เป็น step สุดท้ายเสมอ
---

# Changelog Tracker Skill

ทุกครั้งที่ agent แก้ไข สร้าง หรือลบไฟล์ใดๆ ใน session นั้น ให้บันทึกสรุปการเปลี่ยนแปลงลงใน `CHANGELOG.md` เป็น **step สุดท้ายเสมอ** ก่อนตอบกลับ user

---

## เมื่อไหร่ต้องบันทึก

บันทึกทุกครั้งที่มีการกระทำต่อไปนี้:
- สร้างไฟล์ใหม่ (create_file, bash touch/mkdir)
- แก้ไขไฟล์ (str_replace, bash sed/awk/echo overwrite)
- ลบไฟล์ (bash rm)
- ติดตั้ง package (pip install, npm install, etc.)
- แก้ไข config หรือ environment (`.env`, `pyproject.toml`, `package.json`, etc.)
- รัน migration หรือ script ที่เปลี่ยนแปลง state

**ไม่ต้องบันทึก**: การอ่านไฟล์ (view, cat, ls), การค้นหา, การตอบคำถามทั่วไปที่ไม่มี side effect

---

## รูปแบบ CHANGELOG.md

ใช้รูปแบบ [Keep a Changelog](https://keepachangelog.com/th/1.0.0/) ดัดแปลงเล็กน้อย:

```markdown
# Changelog

## [วันที่] HH:MM — <ชื่อ session หรือ task สั้นๆ>

### Added
- `path/to/file.py` — สร้างไฟล์ใหม่สำหรับ [จุดประสงค์]

### Changed
- `path/to/file.py` บรรทัด 42 — เปลี่ยน logic การ validate email ให้รองรับ subdomain
- `requirements.txt` — เพิ่ม `httpx==0.27.0`

### Removed
- `path/to/old_file.py` — ลบออกเพราะ deprecated แทนด้วย new_file.py

### Fixed
- `path/to/bug.py` — แก้ bug ที่ทำให้ loop วนไม่สิ้นสุดเมื่อ input เป็น None
```

**หลักการเขียน:**
- ระบุ **path ที่แน่นอน** ของไฟล์ที่เปลี่ยนแปลงเสมอ
- อธิบาย **ทำไม** ถึงเปลี่ยน ไม่ใช่แค่ **อะไร**
- ถ้าแก้หลายไฟล์ใน task เดียว ให้รวมอยู่ใน entry เดียวกัน (timestamp เดียวกัน)
- ใช้ภาษาเดียวกับ user (ไทยหรืออังกฤษตามที่ user ใช้)

---

## วิธีเขียนลง CHANGELOG.md

### กรณี CHANGELOG.md ยังไม่มี
สร้างใหม่ที่ root ของ project (หรือ `/home/claude/CHANGELOG.md` ถ้าไม่ชัดเจน):

```bash
cat > CHANGELOG.md << 'EOF'
# Changelog

EOF
```

### กรณี CHANGELOG.md มีอยู่แล้ว
ใช้ `str_replace` หรือ bash เพิ่ม entry ใหม่ **ด้านบนสุด** ถัดจาก `# Changelog`:

```bash
# อ่าน content เดิมก่อน
existing=$(cat CHANGELOG.md)

# เขียน entry ใหม่ต่อด้วย content เดิม
cat > CHANGELOG.md << EOF
# Changelog

## [$(date '+%Y-%m-%d')] $(date '+%H:%M') — <task summary>

### Changed
- \`path/to/file\` — รายละเอียด

${existing#*Changelog}
EOF
```

---

## ตัวอย่างการบันทึกที่ดี

```markdown
## [2025-06-09] 14:32 — เพิ่มระบบ authentication

### Added
- `src/auth/jwt_handler.py` — สร้าง JWT encode/decode สำหรับ user session
- `src/auth/__init__.py` — export ฟังก์ชันหลักออกจาก module

### Changed
- `src/main.py` — เพิ่ม middleware ตรวจสอบ token ก่อน route ทุกอัน
- `requirements.txt` — เพิ่ม `python-jose[cryptography]==3.3.0`

### Fixed
- `src/models/user.py` — แก้ typo ใน field `pasword` → `password` ที่ทำให้ login ไม่ผ่าน
```

---

## ข้อควรระวัง

- **อย่าลืม** บันทึกแม้ว่าจะเป็นการแก้เล็กน้อย (เช่น แก้ typo, เพิ่ม comment)
- ถ้า task ยาวและมีหลาย step ให้บันทึก **ครั้งเดียวตอนท้าย** รวมทุกอย่างใน entry เดียว
- ถ้า user บอกว่า "ไม่ต้องบันทึก changelog" ให้ข้าม step นี้ได้
