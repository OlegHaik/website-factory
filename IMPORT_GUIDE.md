# Гайд: Імпорт XLSX в Supabase

## 🎯 Швидкий старт

### 1. Встановіть залежність
```bash
npm install xlsx
```

### 2. Підготуйте XLSX файл

Ваш XLSX файл повинен мати структуру:
- **Кожен sheet** = окрема таблиця в Supabase
- **Перший рядок** = назви колонок
- **Наступні рядки** = дані

Приклад структури:

**Sheet "content_hero":**
| id | category | headline_spintax | subheadline_spintax |
|----|----------|------------------|---------------------|
| 1 | water_damage | {Emergency\|24/7\|Fast} Response | We {restore\|repair} your property |

**Sheet "content_services":**
| id | category | water_title | water_description |
|----|----------|-------------|-------------------|
| 1 | water_damage | Water Damage {Restoration\|Repair} | Professional {service\|work} |

### 3. Налаштуйте environment variables

Створіть або оновіть `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **ВАЖЛИВО**: Використовуйте `SUPABASE_SERVICE_ROLE_KEY` (не anon key) для batch imports!

### 4. Запустіть імпорт

```bash
# Базовий імпорт
node import-xlsx-to-supabase.js your-file.xlsx

# З опціями
node import-xlsx-to-supabase.js your-file.xlsx --clear --upsert

# Dry run (перевірити без вставки)
node import-xlsx-to-supabase.js your-file.xlsx --dry-run

# Генерувати SQL файл
node import-xlsx-to-supabase.js your-file.xlsx --sql
```

## 📋 Опції командного рядка

| Опція | Опис |
|-------|------|
| `--clear` | Очистити таблицю перед імпортом |
| `--upsert` | Оновити існуючі записи (по id) |
| `--dry-run` | Перевірити файл без вставки даних |
| `--sql` | Згенерувати SQL файл в папці `sql_out/` |

## 🔧 Налаштування mapping

Відредагуйте `import-xlsx-to-supabase.js`, секція `CONFIG.tableMapping`:

```javascript
tableMapping: {
  // Назва sheet в XLSX -> назва таблиці в Supabase
  'Hero Content': 'content_hero',
  'Services': 'content_services',
  'FAQ': 'content_faq',
}
```

## 📊 Для ДУЖЕ ВЕЛИКИХ файлів (>10,000 rows)

### Варіант 1: Збільшити batch size
```javascript
// У файлі import-xlsx-to-supabase.js
batchSize: 500, // Замість 100
```

### Варіант 2: Експорт в SQL
```bash
# Згенерує SQL файл замість прямого insert
node import-xlsx-to-supabase.js huge-file.xlsx --sql
```

Потім:
1. Відкрийте Supabase SQL Editor
2. Завантажте згенерований файл з `sql_out/`
3. Виконайте SQL

### Варіант 3: Розділити файл на частини

```bash
# Використайте Excel/LibreOffice щоб розділити файл на менші частини
# Наприклад: content-part1.xlsx, content-part2.xlsx
node import-xlsx-to-supabase.js content-part1.xlsx
node import-xlsx-to-supabase.js content-part2.xlsx --upsert
```

## 🐛 Troubleshooting

### Помилка: "Missing environment variables"
```bash
# Перевірте, що файл .env.local існує і містить:
cat .env.local
```

### Помилка: "relation does not exist"
Таблиця не створена в Supabase. Виконайте SQL міграції:
```bash
# У Supabase SQL Editor запустіть:
cat SUPABASE_CONTENT_TABLES.sql
```

### Помилка: "column does not exist"
Назви колонок в XLSX не співпадають з schema:
1. Відкрийте XLSX
2. Перевірте назви колонок (перший рядок)
3. Порівняйте з вашою Supabase schema

### Помилка: "insert violates not-null constraint"
Якесь обов'язкове поле порожнє:
1. Знайдіть який стовпець (з повідомлення помилки)
2. Заповніть порожні клітинки в XLSX
3. Або зробіть колонку nullable в Supabase

### Імпорт повільний
```bash
# Використайте більший batch size
batchSize: 500,  // У скрипті

# Або згенеруйте SQL та виконайте напряму
node import-xlsx-to-supabase.js file.xlsx --sql
```

## 💡 Поради

### 1. Завжди робіть backup перед --clear
```sql
-- У Supabase SQL Editor
CREATE TABLE content_hero_backup AS SELECT * FROM content_hero;
```

### 2. Використовуйте --dry-run для перевірки
```bash
node import-xlsx-to-supabase.js file.xlsx --dry-run
```

### 3. JSON колонки
Якщо у вас є колонки з JSON (наприклад, `items`), форматуйте їх так:
```
[{"question":"Q1","answer":"A1"},{"question":"Q2","answer":"A2"}]
```

### 4. Спінтекст
Спінтекст працює як є - просто вставте текст з дужками:
```
{Emergency|24/7|Fast} {Water Damage|Flood} {Restoration|Repair}
```

### 5. Категорії
Додайте колонку `category` в кожен sheet:
```
water_damage
roofing
mold_remediation
```

## 🔄 Альтернативний метод: CSV Import

Якщо XLSX проблематичний:

1. **Експортуйте кожен sheet в CSV** (Save As → CSV UTF-8)

2. **Використайте Supabase UI**:
   - Table Editor → вибрати таблицю
   - Import data from CSV
   - Upload файл

3. **Або використайте psql**:
```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres" \
  -c "\COPY content_hero FROM 'hero.csv' WITH (FORMAT csv, HEADER true)"
```

## 📞 Підтримка

Якщо виникли проблеми:
1. Перевірте формат XLSX файлу
2. Запустіть з --dry-run
3. Згенеруйте SQL файл для ручного review
4. Перевірте Supabase logs (Dashboard → Logs)
