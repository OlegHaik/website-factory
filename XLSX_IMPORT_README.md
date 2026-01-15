# 📊 XLSX Import Tools - Повний гайд

## 🎯 Швидкий старт (3 кроки)

```bash
# 1. Встановити залежність
npm install xlsx

# 2. Налаштувати environment
echo "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key" >> .env.local

# 3. Імпортувати
node import-xlsx-to-supabase.js your-spintax-file.xlsx
```

---

## 📦 Доступні інструменти

| Інструмент | Призначення | Коли використовувати |
|------------|-------------|---------------------|
| **validate-xlsx.js** | Перевірка файлу | Перед імпортом |
| **import-xlsx-to-supabase.js** | Повнофункціональний імпорт | Великі файли, production |
| **import-simple.js** | Простий імпорт | Малі файли, тестування |
| **split-xlsx.js** | Розділення на частини | Файли >10k rows |

---

## 🔧 1. Валідація файлу (рекомендовано)

**Перевіряє файл перед імпортом:**

```bash
node validate-xlsx.js your-file.xlsx
```

**Що перевіряється:**
- ✅ Наявність обов'язкових колонок
- ✅ Валідність JSON у JSON-колонках
- ✅ Пусті обов'язкові поля
- ✅ Правильність назв category

**Приклад виводу:**
```
📄 Sheet: content_hero
   Rows: 150
   ✅ Valid

📄 Sheet: content_faq
   Rows: 75
   ❌ 3 errors
   ⚠️  2 warnings

❌ ERRORS:
   - Row 15: Required field "category" is empty
   - Row 23: Invalid JSON in "items"
   
⚠️  WARNINGS:
   - Row 50: Unusual category value "custom_category"
```

---

## 📥 2. Імпорт даних

### Варіант A: Повний імпорт (рекомендовано)

```bash
# Базовий імпорт
node import-xlsx-to-supabase.js spintax-content.xlsx

# З очищенням таблиць перед імпортом
node import-xlsx-to-supabase.js spintax-content.xlsx --clear

# Оновлення існуючих записів
node import-xlsx-to-supabase.js spintax-content.xlsx --upsert

# Комбінація (видалити все і імпортувати)
node import-xlsx-to-supabase.js spintax-content.xlsx --clear --upsert

# Dry run (тестування без вставки)
node import-xlsx-to-supabase.js spintax-content.xlsx --dry-run

# Генерація SQL файлу
node import-xlsx-to-supabase.js spintax-content.xlsx --sql
```

**Переваги:**
- ✅ Batch insert (100 rows за раз)
- ✅ Автоматична нормалізація даних
- ✅ Підтримка JSON колонок
- ✅ Progress bar та детальні логи

### Варіант B: Простий імпорт

```bash
node import-simple.js spintax-content.xlsx
```

**Коли використовувати:**
- Невеликий файл (<1000 rows)
- Потрібен детальний debug кожного рядка
- Тестування імпорту

---

## ✂️ 3. Розділення великих файлів

**Якщо файл дуже великий (>10,000 rows):**

```bash
# Розділити на файли по 1000 rows
node split-xlsx.js large-file.xlsx 1000

# Результат:
# large-file-content_hero-part1.xlsx
# large-file-content_hero-part2.xlsx
# large-file-content_faq-part1.xlsx
# ...

# Імпортувати частинами
node import-xlsx-to-supabase.js large-file-content_hero-part1.xlsx
node import-xlsx-to-supabase.js large-file-content_hero-part2.xlsx --upsert
```

---

## 📋 Структура XLSX файлу

### Основні правила:

1. **Кожен sheet = окрема таблиця**
   ```
   Sheet "content_hero" → таблиця "content_hero"
   Sheet "content_faq"  → таблиця "content_faq"
   ```

2. **Перший рядок = назви колонок**
   ```
   | id | category | headline_spintax | subheadline_spintax |
   ```

3. **Назви колонок = як у database**
   ```
   headline_spintax  ✅
   Headline Spintax  ❌ (будуть пробіли)
   headlineSpintax   ❌ (camelCase не підтримується)
   ```

### Приклад структури:

**Sheet: content_hero**
```
| id | category      | headline_spintax                          | subheadline_spintax                    |
|----|---------------|-------------------------------------------|----------------------------------------|
| 1  | water_damage  | {Emergency|24/7|Fast} Water Damage {Help|Service} | We {restore|repair|fix} your property {quickly|fast} |
| 2  | roofing       | {Professional|Expert|Quality} Roofing     | {Reliable|Trusted} {service|solutions}  |
```

**Sheet: content_faq** (з JSON)
```
| id | category      | heading_spintax | items                                                      |
|----|---------------|-----------------|-----------------------------------------------------------|
| 1  | water_damage  | Common Questions | [{"question":"How fast?","answer":"Within 60 minutes"}]  |
```

### Спінтекст синтаксис:

```
{option1|option2|option3}         - випадковий вибір
{{variable_name}}                 - змінна (city, state, business_name, phone)
{Emergency|24/7} {{business_name}} - комбінація
```

**Приклади:**
```
{Emergency|24/7|Fast} Water Damage
→ "Emergency Water Damage" або "24/7 Water Damage" або "Fast Water Damage"

Serving {{city}}, {{state}}
→ "Serving Miami, FL"

{Call|Contact} us at {{phone}}
→ "Call us at (305) 555-1234"
```

---

## 🔐 Environment Variables

**Потрібні змінні у `.env.local`:**

```bash
# Supabase URL (обов'язково)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Service Role Key (рекомендовано для batch import)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key

# АБО Anon Key (для невеликих імпортів)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
```

**⚠️ ВАЖЛИВО:**
- `SERVICE_ROLE_KEY` має повні права - **НЕ commitте в Git!**
- Для production імпортів завжди використовуйте `SERVICE_ROLE_KEY`
- `ANON_KEY` має обмеження RLS - може не спрацювати для batch insert

---

## 📊 Таблиці Supabase

**Перед імпортом переконайтеся, що таблиці створені:**

```bash
# У Supabase SQL Editor виконайте:
cat SUPABASE_CONTENT_TABLES.sql
cat SUPABASE_STYLES_AND_SITES.sql
cat SUPABASE_MIGRATION_2025-12_citations_and_constraints.sql
```

**Основні таблиці:**
- `content_header` - навігація, кнопки
- `content_hero` - hero секція
- `content_services` - список послуг
- `content_cta` - call-to-action
- `content_seo_body` - SEO текст
- `content_faq` - FAQ items
- `content_testimonials` - відгуки
- `content_service_pages` - сторінки послуг
- `content_service_area` - сторінки локацій
- `content_blocks` - structured content blocks
- `content_meta` - meta tags
- `content_legal` - privacy/terms

---

## 🐛 Troubleshooting

### ❌ "Missing environment variables"

```bash
# Перевірте .env.local
cat .env.local

# Або встановіть тимчасово:
export NEXT_PUBLIC_SUPABASE_URL=https://...
export SUPABASE_SERVICE_ROLE_KEY=eyJ...
node import-xlsx-to-supabase.js file.xlsx
```

### ❌ "relation does not exist"

**Таблиця не створена в Supabase:**
```sql
-- У Supabase SQL Editor:
CREATE TABLE content_hero (
  id SERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  headline_spintax TEXT,
  subheadline_spintax TEXT,
  chat_button_spintax TEXT
);
```

### ❌ "column does not exist"

**Назви колонок в XLSX не відповідають schema:**
1. Відкрийте XLSX
2. Перевірте назви в першому рядку
3. Порівняйте з вашою Supabase schema
4. Переіменуйте колонки (або оновіть schema)

### ❌ "insert violates not-null constraint"

**Обов'язкове поле порожнє:**
```bash
# Спочатку запустіть валідацію:
node validate-xlsx.js file.xlsx

# Вона покаже які поля порожні:
# Row 15: Required field "category" is empty
```

### ❌ "File too large" або Memory error

```bash
# Варіант 1: Розділити файл
node split-xlsx.js large-file.xlsx 1000

# Варіант 2: Генерувати SQL
node import-xlsx-to-supabase.js large-file.xlsx --sql
```

### ⚠️ Імпорт повільний

```bash
# Збільшити batch size у import-xlsx-to-supabase.js:
batchSize: 500  // замість 100

# Або використати SQL метод:
node import-xlsx-to-supabase.js file.xlsx --sql
# Потім виконати SQL в Supabase (набагато швидше)
```

### 🔤 Проблеми з кодуванням (українські символи)

```javascript
// У import-xlsx-to-supabase.js, функція readXlsxFile:
const workbook = XLSX.readFile(filePath, { 
  type: 'buffer',
  cellDates: true,
  codepage: 65001 // UTF-8
})
```

---

## 💡 Best Practices

### 1. Завжди робіть backup

```bash
# У Supabase Dashboard:
# Database → Backups → Create Manual Backup

# Або експортуйте існуючі дані:
node -e "
const {createClient} = require('@supabase/supabase-js');
const fs = require('fs');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const tables = ['content_hero', 'content_faq', 'content_services'];
  for (const table of tables) {
    const {data} = await supabase.from(table).select('*');
    fs.writeFileSync(\`backup-\${table}.json\`, JSON.stringify(data, null, 2));
  }
  console.log('✅ Backup complete!');
})();
"
```

### 2. Workflow рекомендований

```bash
# 1. Валідація
node validate-xlsx.js spintax-content.xlsx

# 2. Dry run
node import-xlsx-to-supabase.js spintax-content.xlsx --dry-run

# 3. Backup
# (у Supabase Dashboard)

# 4. Імпорт
node import-xlsx-to-supabase.js spintax-content.xlsx --clear --upsert

# 5. Перевірка
# (відкрийте сайт і перевірте контент)
```

### 3. Для production

```bash
# 1. Тестування на staging:
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=staging-key \
node import-xlsx-to-supabase.js content.xlsx

# 2. Якщо OK, на production:
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=prod-key \
node import-xlsx-to-supabase.js content.xlsx --clear --upsert
```

### 4. Git ignore

**Додайте в `.gitignore`:**
```
# XLSX files (можуть бути великі)
*.xlsx
!template.xlsx  # окрім template

# Backup files
backup-*.json
backup-*.sql

# Generated SQL
sql_out/import-*.sql

# Environment with keys
.env.local
```

---

## 📚 Додаткові ресурси

- **IMPORT_GUIDE.md** - детальна документація імпорту
- **XLSX_IMPORT_QUICKSTART.md** - швидкий старт з прикладами
- **DEPLOYMENT.md** - deployment на Vercel
- **README.md** - загальна інформація про проект

---

## ❓ FAQ

**Q: Скільки часу займе імпорт 10,000 rows?**  
A: ~3-5 хвилин через script, ~1 хвилина через SQL метод

**Q: Чи можу імпортувати в існуючі таблиці з даними?**  
A: Так, використовуйте `--upsert` (оновить існуючі по id)

**Q: Що робити якщо є помилки імпорту?**  
A: Запустіть `validate-xlsx.js` - покаже всі проблеми

**Q: Чи безпечно використовувати SERVICE_ROLE_KEY?**  
A: Так, якщо він в `.env.local` (не в Git) і тільки на локальній машині

**Q: Як оновити тільки одну таблицю?**  
A: Видаліть інші sheets з XLSX файлу перед імпортом

**Q: Підтримується Excel 97-2003 (.xls)?**  
A: Так, але краще використовувати .xlsx (сучасний формат)

---

## 🚀 Готово до імпорту!

```bash
npm install xlsx
node validate-xlsx.js your-file.xlsx
node import-xlsx-to-supabase.js your-file.xlsx
```

**Успіхів! 🎉**
