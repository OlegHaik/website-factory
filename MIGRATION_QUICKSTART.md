# 🎯 ЯКІСНА МІГРАЦІЯ - Покроковий план

[ПОВНИЙ ДЕТАЛЬНИЙ ПЛАН - див. вище в чаті]

## 📋 Швидкий старт:

### ✅ КРОК 1: Створити таблиці

У Supabase SQL Editor виконайте:
```
MIGRATION_complete_new_structure.sql
```

### ✅ КРОК 2: Імпортувати дані

```bash
node import-full-master-spintext.js "MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx"
```

**Має імпортувати 612+ рядків без помилок**

### ✅ КРОК 3: Перевірити

```sql
SELECT table_name, COUNT(*) as rows
FROM (
  SELECT 'content_hero_new' as table_name, COUNT(*) FROM content_hero_new
  UNION ALL SELECT 'content_header_new', COUNT(*) FROM content_header_new
  UNION ALL SELECT 'content_faq_new', COUNT(*) FROM content_faq_new
  UNION ALL SELECT 'content_testimonials_new', COUNT(*) FROM content_testimonials_new
  UNION ALL SELECT 'content_services_new', COUNT(*) FROM content_services_new
) t
GROUP BY table_name;
```

**Очікуємо:**
- content_hero_new: 16
- content_header_new: 16
- content_faq_new: 192
- content_testimonials_new: 100
- content_services_new: 96

### ✅ КРОК 4: Оновити код

Створити `lib/fetch-content-new.ts` з новими функціями (код вище)

### ✅ КРОК 5: Тестувати

```bash
npm run dev
# Перевірити тестову сторінку
```

### ✅ КРОК 6: Активувати (коли все працює)

```sql
-- Backup + rename
ALTER TABLE content_faq RENAME TO content_faq_old_backup;
ALTER TABLE content_faq_new RENAME TO content_faq;
-- повторити для всіх таблиць
```

---

**Повний детальний план з усіма командами та code snippets створений!**

Готові почати з КРОКУ 1? 🚀
