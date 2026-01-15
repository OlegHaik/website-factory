# ⚠️ Робота з існуючими даними в Supabase

## Проблема: Конфлікти при імпорті

Якщо у вас **вже є дані** в Supabase, імпорт може:
- ❌ Створити дублікати (якщо `id` відрізняються)
- ❌ Викликати помилку "duplicate key" (якщо `id` співпадають)
- ❌ Перезаписати існуючі дані (з `--upsert`)

---

## 🎯 Стратегії вирішення

### Стратегія 1: Merge існуючих даних (РЕКОМЕНДОВАНО) ✅

**Коли використовувати**: У вас є дані в БД і в XLSX, потрібно об'єднати

#### Крок 1: Експортуйте існуючі дані

```bash
node export-from-supabase.js
```

Створіть файл `export-from-supabase.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')
const XLSX = require('xlsx')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function exportToXlsx() {
  const tables = [
    'content_hero',
    'content_services',
    'content_faq',
    'content_testimonials',
    'content_service_pages',
    'content_blocks'
  ]
  
  const workbook = XLSX.utils.book_new()
  
  for (const table of tables) {
    console.log(`📥 Exporting ${table}...`)
    const { data, error } = await supabase.from(table).select('*')
    
    if (error) {
      console.warn(`⚠️  Could not export ${table}:`, error.message)
      continue
    }
    
    if (!data || data.length === 0) {
      console.log(`   ⏭️  Empty table, skipping`)
      continue
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet, table)
    console.log(`   ✅ Exported ${data.length} rows`)
  }
  
  const filename = `supabase-export-${Date.now()}.xlsx`
  XLSX.writeFile(workbook, filename)
  console.log(`\n✅ Export complete: ${filename}`)
}

exportToXlsx().catch(console.error)
```

#### Крок 2: Об'єднайте вручну

1. Відкрийте експортований файл
2. Відкрийте ваш новий XLSX файл
3. Скопіюйте нові рядки в експортований файл
4. Збережіть як `merged-content.xlsx`

#### Крок 3: Імпортуйте з upsert

```bash
npm run import merged-content.xlsx -- --upsert
```

**Що станеться:**
- ✅ Існуючі records (з однаковим `id`) оновляться
- ✅ Нові records додадуться
- ✅ Нічого не видалиться

---

### Стратегія 2: Clear & Import (НЕБЕЗПЕЧНО) ⚠️

**Коли використовувати**: Хочете **видалити все** і почати з нуля

```bash
# УВАГА: Це видалить ВСІ існуючі дані!
npm run import your-file.xlsx -- --clear
```

**⚠️ ОБОВ'ЯЗКОВО зробіть backup:**

```bash
# 1. Експорт існуючих даних
node export-from-supabase.js

# 2. Або backup в Supabase Dashboard:
# Database → Backups → Create Manual Backup

# 3. Тільки тоді --clear
npm run import your-file.xlsx -- --clear
```

---

### Стратегія 3: Уникнути конфліктів ID 🔢

**Коли використовувати**: Хочете додати нові дані БЕЗ конфліктів

#### Варіант A: Використовуйте нові ID

```bash
# 1. Дізнайтесь максимальний ID
node -e "
const {createClient} = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
(async () => {
  const {data} = await supabase.from('content_hero').select('id').order('id', {ascending: false}).limit(1);
  console.log('Max ID:', data[0]?.id || 0);
})();
"

# 2. У вашому XLSX почніть ID з (max_id + 1)
# Наприклад, якщо max_id = 100, почніть з 101

# 3. Імпортуйте
npm run import your-file.xlsx
```

#### Варіант B: Видаліть колонку ID (автоінкремент)

У вашому XLSX:
1. Видаліть колонку `id`
2. Postgres автоматично створить нові ID

```bash
npm run import your-file-no-ids.xlsx
```

---

### Стратегія 4: Імпортувати тільки нові таблиці 📋

**Коли використовувати**: Деякі таблиці порожні, деякі - ні

```bash
# 1. Перевірте які таблиці порожні
node check-tables.js
```

Створіть `check-tables.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkTables() {
  const tables = [
    'content_hero', 'content_header', 'content_services',
    'content_cta', 'content_seo_body', 'content_faq',
    'content_testimonials', 'content_service_pages',
    'content_service_area', 'content_blocks', 'content_meta'
  ]
  
  console.log('📊 Checking tables:\n')
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
    
    const status = count === 0 ? '✅ Empty' : `⚠️  ${count} rows`
    console.log(`${table.padEnd(30)} ${status}`)
  }
}

checkTables().catch(console.error)
```

```bash
node check-tables.js

# Вивід:
# content_hero                   ⚠️  50 rows   <- Є дані
# content_services               ✅ Empty      <- Можна імпортувати
# content_faq                    ✅ Empty      <- Можна імпортувати
```

**Рішення:**
1. Видаліть з XLSX файлу sheets з існуючими даними
2. Залишіть тільки порожні таблиці
3. Імпортуйте

```bash
npm run import only-empty-tables.xlsx
```

---

### Стратегія 5: Incremental Import (найбезпечніше) 🛡️

**Крок-за-кроком імпорт з перевіркою:**

```bash
# 1. Валідація
npm run import:validate your-file.xlsx

# 2. Dry run (перевірка БЕЗ вставки)
npm run import your-file.xlsx -- --dry-run

# 3. Backup
node export-from-supabase.js
# АБО: Supabase Dashboard → Create Backup

# 4. Тестовий імпорт з upsert
npm run import your-file.xlsx -- --upsert

# 5. Перевірте сайт - чи все ОК?

# 6. Якщо щось не так - rollback:
npm run import supabase-export-[timestamp].xlsx -- --clear --upsert
```

---

## 🔍 Як дізнатись, що у вас в БД зараз?

### Варіант 1: Через Supabase Dashboard

1. Відкрийте Supabase Dashboard
2. Table Editor → виберіть таблицю
3. Подивіться скільки rows і які ID

### Варіант 2: Через SQL Editor

```sql
-- Перевірити всі таблиці
SELECT 
  'content_hero' as table_name,
  COUNT(*) as row_count,
  MAX(id) as max_id
FROM content_hero
UNION ALL
SELECT 
  'content_services',
  COUNT(*),
  MAX(id)
FROM content_services
UNION ALL
SELECT 
  'content_faq',
  COUNT(*),
  MAX(id)
FROM content_faq;
```

### Варіант 3: Через скрипт

```bash
node check-tables.js  # (створили вище)
```

---

## 📊 Decision Tree (Що обрати?)

```
Чи є дані в Supabase зараз?
│
├─ НІ (порожні таблиці)
│  └─> Просто імпортуйте: npm run import file.xlsx
│
└─ ТАК (є дані)
   │
   ├─ Хочете зберегти існуючі дані?
   │  │
   │  ├─ ТАК
   │  │  ├─> Стратегія 1: Merge (export + об'єднати + upsert)
   │  │  └─> Стратегія 5: Incremental (найбезпечніше)
   │  │
   │  └─ НІ (видалити все)
   │     └─> Стратегія 2: Clear & Import (з backup!)
   │
   └─ Нові дані конфліктують з існуючими ID?
      │
      ├─ ТАК
      │  ├─> Стратегія 3: Змінити ID в XLSX
      │  └─> Стратегія 1: Merge з ручним вирішенням
      │
      └─ НІ
         └─> npm run import file.xlsx -- --upsert
```

---

## 💡 Рекомендації для вашої ситуації

### Якщо у вас МАЛО даних в БД (<100 rows):

```bash
# 1. Експорт
node export-from-supabase.js

# 2. Імпорт з upsert
npm run import your-file.xlsx -- --upsert

# 3. Якщо щось не так - швидко rollback
```

### Якщо у вас БАГАТО даних в БД (>100 rows):

```bash
# 1. Backup в Supabase Dashboard!
# 2. Перевірте конфлікти:
node check-tables.js

# 3. Incremental import:
npm run import your-file.xlsx -- --upsert --dry-run  # test
npm run import your-file.xlsx -- --upsert              # real
```

### Якщо НЕ ВПЕВНЕНІ:

```bash
# Найбезпечніший варіант:
# 1. Експорт існуючих даних
node export-from-supabase.js

# 2. Створіть STAGING environment
# (окремий Supabase project)

# 3. Тестуйте там
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co \
npm run import your-file.xlsx

# 4. Якщо OK - тоді на production
```

---

## 🚨 Checklist перед імпортом

- [ ] ✅ Зробив backup (export або Supabase backup)
- [ ] ✅ Перевірив які таблиці не порожні (`check-tables.js`)
- [ ] ✅ Перевірив чи є конфлікти ID
- [ ] ✅ Запустив валідацію (`npm run import:validate`)
- [ ] ✅ Зробив dry-run (`--dry-run`)
- [ ] ✅ Маю план rollback якщо щось піде не так
- [ ] ✅ (Опційно) Протестував на staging

**Тільки після цього:**

```bash
npm run import your-file.xlsx -- --upsert
```

---

## 🔄 Rollback (якщо щось пішло не так)

### Якщо ви зробили export:

```bash
npm run import supabase-export-[timestamp].xlsx -- --clear --upsert
```

### Якщо ви зробили Supabase backup:

1. Supabase Dashboard → Database → Backups
2. Знайдіть ваш backup
3. Restore

### Якщо нічого не робили (😱):

```sql
-- У Supabase SQL Editor відкатіть транзакції
-- (Це працює тільки якщо ви швидко помітили помилку)

-- Видалити records додані після певного часу:
DELETE FROM content_hero 
WHERE created_at > '2025-01-14 20:00:00';
```

---

## 📞 Потрібна допомога?

**Перед імпортом напишіть мені:**
1. Скільки rows у вас зараз в БД? (`node check-tables.js`)
2. Скільки rows у вашому XLSX?
3. Чи хочете зберегти існуючі дані?

**Я підкажу найкращу стратегію!** 🎯
