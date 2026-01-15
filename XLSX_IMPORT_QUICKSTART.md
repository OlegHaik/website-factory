# Quick Reference: XLSX Import Methods

## Метод 1: Автоматичний скрипт (рекомендовано) 🚀

**Коли використовувати**: Великий файл, потрібна гнучкість, batch import

```bash
# 1. Встановити залежність
npm install xlsx

# 2. Налаштувати .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=your-key" >> .env.local

# 3. Запустити
node import-xlsx-to-supabase.js your-file.xlsx

# З опціями:
node import-xlsx-to-supabase.js your-file.xlsx --clear --upsert
```

**Переваги**:
- ✅ Batch insert (швидко для великих файлів)
- ✅ Автоматична нормалізація даних
- ✅ Підтримка JSON колонок
- ✅ Генерація SQL backup

---

## Метод 2: Простий скрипт 📝

**Коли використовувати**: Невеликий файл (<1000 rows), швидкий тест

```bash
# Структура XLSX точно відповідає таблицям
node import-simple.js your-file.xlsx
```

**Переваги**:
- ✅ Простий код
- ✅ Легко налагодити
- ✅ Детальні повідомлення про помилки

---

## Метод 3: CSV через Supabase UI 🖱️

**Коли використовувати**: Без програмування, швидкий import

```bash
# 1. Експортувати кожен sheet в CSV (UTF-8)
# 2. У Supabase → Table Editor → Import Data
# 3. Upload CSV файл
```

**Переваги**:
- ✅ Без коду
- ✅ Візуальна перевірка
- ✅ Вбудована валідація

**Обмеження**:
- ❌ По одній таблиці за раз
- ❌ Ручна робота для багатьох sheets

---

## Метод 4: SQL Generate 📄

**Коли використовувати**: Дуже великий файл, потрібен контроль, review перед import

```bash
# 1. Згенерувати SQL файл
node import-xlsx-to-supabase.js huge-file.xlsx --sql --dry-run

# 2. Відкрити файл sql_out/import-*.sql
# 3. Review SQL
# 4. Виконати в Supabase SQL Editor
```

**Переваги**:
- ✅ Повний контроль
- ✅ Можна редагувати SQL
- ✅ Backup перед виконанням
- ✅ Швидко для величезних файлів

---

## Метод 5: Ручний SQL 🔧

**Коли використовувати**: Особлива структура, потрібна кастомізація

```sql
-- Створити тимчасову таблицю
CREATE TEMP TABLE temp_import (
  id INT,
  category TEXT,
  headline_spintax TEXT,
  subheadline_spintax TEXT
);

-- Імпортувати через COPY (у psql)
\COPY temp_import FROM 'data.csv' WITH CSV HEADER;

-- Перенести в основну таблицю з трансформаціями
INSERT INTO content_hero (id, category, headline_spintax, subheadline_spintax)
SELECT 
  id,
  LOWER(category),
  TRIM(headline_spintax),
  TRIM(subheadline_spintax)
FROM temp_import;
```

---

## Який метод обрати? 🤔

| Розмір файлу | Складність | Метод |
|--------------|------------|-------|
| < 500 rows | Проста структура | **Метод 2** (Simple) |
| < 5000 rows | Стандартна структура | **Метод 1** (Auto) |
| > 5000 rows | Стандартна структура | **Метод 1** з `--sql` |
| Будь-який | Без програмування | **Метод 3** (CSV UI) |
| Будь-який | Особлива логіка | **Метод 5** (SQL) |

---

## Типові проблеми та рішення

### Проблема: File too large
```bash
# Розділити на частини
node split-xlsx.js large-file.xlsx

# Імпортувати частинами
node import-xlsx-to-supabase.js part1.xlsx
node import-xlsx-to-supabase.js part2.xlsx --upsert
```

### Проблема: Memory error
```bash
# Використати SQL метод
node import-xlsx-to-supabase.js file.xlsx --sql
# Потім виконати SQL в Supabase
```

### Проблема: Encoding issues (українські символи)
```javascript
// У import-xlsx-to-supabase.js додати:
const workbook = XLSX.readFile(filePath, { 
  type: 'buffer',
  codepage: 65001 // UTF-8
})
```

### Проблема: Duplicate rows
```bash
# Використати upsert mode
node import-xlsx-to-supabase.js file.xlsx --clear --upsert
```

---

## Приклад структури XLSX

**Sheet: content_hero**
```
| id | category      | headline_spintax                    | subheadline_spintax           |
|----|---------------|-------------------------------------|-------------------------------|
| 1  | water_damage  | {Emergency|24/7} Water Damage Help  | We {restore|repair} fast      |
| 2  | roofing       | {Professional|Expert} Roofing       | {Quality|Reliable} service    |
```

**Sheet: content_faq**
```
| id | category      | heading_spintax | items (JSON)                           |
|----|---------------|-----------------|----------------------------------------|
| 1  | water_damage  | FAQ             | [{"question":"Q1","answer":"A1"}]      |
```

**Важливо**:
- ✅ Перший рядок = назви колонок
- ✅ Назви колонок = назви в database schema
- ✅ JSON колонки = валідний JSON string
- ✅ Empty cells = NULL у database

---

## Performance Tips

### Для файлів < 1000 rows:
```bash
node import-simple.js file.xlsx
```
**Time**: ~30 секунд

### Для файлів 1000-10000 rows:
```bash
node import-xlsx-to-supabase.js file.xlsx
```
**Time**: ~2-5 хвилин

### Для файлів > 10000 rows:
```bash
# Generate SQL
node import-xlsx-to-supabase.js file.xlsx --sql

# Execute in Supabase SQL Editor
```
**Time**: ~1-2 хвилини (виконання SQL)

---

## Backup Strategy

```bash
# Перед імпортом завжди робіть backup:

# 1. SQL backup в Supabase
# Dashboard → Database → Backups → Create Backup

# 2. Або export існуючих даних:
node -e "
  const {createClient} = require('@supabase/supabase-js');
  const fs = require('fs');
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  
  (async () => {
    const {data} = await supabase.from('content_hero').select('*');
    fs.writeFileSync('backup-hero.json', JSON.stringify(data, null, 2));
    console.log('Backup saved!');
  })();
"
```
