# 📦 XLSX Import Solution - Summary

## ✅ Що створено

Повний набір інструментів для імпорту великих XLSX файлів зі спінтекстом у Supabase:

### 🛠️ Скрипти

1. **validate-xlsx.js** - Валідація перед імпортом
2. **import-xlsx-to-supabase.js** - Повнофункціональний імпорт (batch, upsert, SQL gen)
3. **import-simple.js** - Простий імпорт для маленьких файлів
4. **split-xlsx.js** - Розділення великих файлів на частини
5. **check-tables.js** - Перевірка стану БД
6. **export-from-supabase.js** - Експорт існуючих даних (backup)

### 📚 Документація

1. **XLSX_IMPORT_README.md** - Головний гайд (почніть тут!)
2. **IMPORT_GUIDE.md** - Детальна документація
3. **XLSX_IMPORT_QUICKSTART.md** - Швидкий старт з прикладами
4. **XLSX_TEMPLATE_STRUCTURE.md** - Структура XLSX файлу

### 📝 NPM Scripts

Додано у `package.json`:
```json
"import:validate": "node validate-xlsx.js",
"import:simple": "node import-simple.js",
"import": "node import-xlsx-to-supabase.js",
"import:split": "node split-xlsx.js",
"db:check": "node check-tables.js",
"db:export": "node export-from-supabase.js"
```

---

## 🚀 Швидкий старт

### ⚠️ ВАЖЛИВО: Чи є у вас дані в Supabase?

**Якщо ТАК** (є існуючі дані):
```bash
# 1. Перевірте що у вас в БД
npm run db:check

# 2. Зробіть backup
npm run db:export

# 3. Імпортуйте з upsert (оновить існуючі)
npm run import your-file.xlsx -- --upsert
```

**Якщо НІ** (порожні таблиці):
```bash
# Просто імпортуйте
npm install xlsx
npm run import your-file.xlsx
```

📖 **Детальніше про конфлікти**: `XLSX_CONFLICT_RESOLUTION.md`

---

## 🔧 Базова установка (3 кроки)

### 1. Встановити залежність

```bash
npm install xlsx
```

### 2. Налаштувати .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

⚠️ **SERVICE_ROLE_KEY** (не ANON_KEY) для batch imports!

### 3. Перевірити стан БД

```bash
# Подивіться що у вас зараз в Supabase
npm run db:check
```

**Готово!** 🎉

---

## 📊 Структура XLSX файлу

### Основні правила:

1. **Кожен sheet = окрема Supabase таблиця**
   - Sheet "content_hero" → таблиця `content_hero`
   - Sheet "content_faq" → таблиця `content_faq`

2. **Перший рядок = назви колонок**
   - Точно як у Supabase schema
   - Використовуйте `snake_case` (не spaces, не camelCase)

3. **Спінтекст синтаксис:**
   - `{option1|option2|option3}` - випадковий вибір
   - `{{city}}`, `{{state}}`, `{{business_name}}`, `{{phone}}` - змінні

### Приклад:

**Sheet: content_hero**

| id | category | headline_spintax | subheadline_spintax |
|----|----------|------------------|---------------------|
| 1 | water_damage | {Emergency\|24/7\|Fast} Water Damage in {{city}} | We {restore\|repair} your property {quickly\|fast} |
| 2 | roofing | {Professional\|Expert} Roofing in {{city}} | {Quality\|Reliable} {service\|solutions} |

Детальна структура: **XLSX_TEMPLATE_STRUCTURE.md**

---

## 🎯 Для різних розмірів файлів

### Маленький файл (<500 rows)

```bash
npm run import:simple your-file.xlsx
```
**Швидкість**: ~30 секунд

### Середній файл (500-5000 rows)

```bash
npm run import:validate your-file.xlsx
npm run import your-file.xlsx -- --clear --upsert
```
**Швидкість**: 2-5 хвилин

### Великий файл (>5000 rows)

**Варіант A: SQL Generation (рекомендовано)**
```bash
npm run import your-file.xlsx -- --sql --dry-run
# Згенерує файл у sql_out/
# Виконайте його в Supabase SQL Editor
```
**Швидкість**: 1-2 хвилини

**Варіант B: Split + Import**
```bash
npm run import:split your-file.xlsx 1000
npm run import part1.xlsx
npm run import part2.xlsx -- --upsert
```
**Швидкість**: залежить від кількості частин

---

## 🔧 Опції командного рядка

| Опція | Що робить |
|-------|-----------|
| `--clear` | Очистити таблицю перед імпортом |
| `--upsert` | Оновити існуючі записи (по id) |
| `--dry-run` | Тест без вставки даних |
| `--sql` | Згенерувати SQL файл |

**Приклади:**

```bash
# Видалити все і імпортувати
npm run import file.xlsx -- --clear

# Оновити існуючі записи
npm run import file.xlsx -- --upsert

# Перевірка без зміни БД
npm run import file.xlsx -- --dry-run

# Комбінація
npm run import file.xlsx -- --clear --upsert --sql
```

---

## 🐛 Troubleshooting

### Помилка: "Missing environment variables"

```bash
# Перевірте .env.local
cat .env.local

# Має бути:
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### Помилка: "relation does not exist"

Таблиця не створена. Виконайте міграції:

```bash
# У Supabase SQL Editor:
cat SUPABASE_CONTENT_TABLES.sql
# Скопіюйте і виконайте
```

### Помилка: "column does not exist"

Назви колонок в XLSX не збігаються з БД:

```bash
# Запустіть валідацію - покаже проблеми:
npm run import:validate your-file.xlsx
```

### Імпорт дуже повільний

```bash
# Використайте SQL метод:
npm run import file.xlsx -- --sql
# Потім виконайте SQL в Supabase
```

### Проблеми з українськими символами

```javascript
// Відредагуйте import-xlsx-to-supabase.js:
const workbook = XLSX.readFile(filePath, { 
  codepage: 65001 // UTF-8
})
```

---

## 💡 Best Practices

### 1. Завжди валідуйте спочатку

```bash
npm run import:validate file.xlsx
```

### 2. Зробіть backup перед імпортом

У Supabase Dashboard:
- Database → Backups → Create Manual Backup

### 3. Тестуйте на staging спочатку

```bash
# Staging
NEXT_PUBLIC_SUPABASE_URL=https://staging.supabase.co \
npm run import file.xlsx

# Якщо OK, тоді production
```

### 4. Використовуйте --dry-run для великих файлів

```bash
npm run import huge-file.xlsx -- --dry-run
# Перевірте що все ОК, потім без --dry-run
```

---

## 📖 Додаткова документація

- **XLSX_IMPORT_README.md** - Повний гайд з усіма деталями
- **XLSX_TEMPLATE_STRUCTURE.md** - Детальна структура кожного sheet
- **IMPORT_GUIDE.md** - Технічна документація
- **XLSX_IMPORT_QUICKSTART.md** - Швидкі команди та FAQ

---

## 🎓 Навчальний приклад

### 1. Підготовка

```bash
# Встановити
npm install xlsx

# Створити .env.local
echo "SUPABASE_SERVICE_ROLE_KEY=your-key" >> .env.local
```

### 2. Підготувати XLSX

Створіть файл `my-spintax.xlsx` з sheets:
- content_hero
- content_services
- content_faq

(Дивіться XLSX_TEMPLATE_STRUCTURE.md для структури)

### 3. Валідація

```bash
npm run import:validate my-spintax.xlsx
```

**Вивід:**
```
✅ Valid
📊 3 sheets, 0 errors, 0 warnings
```

### 4. Імпорт

```bash
npm run import my-spintax.xlsx -- --clear
```

**Вивід:**
```
📊 Processing sheet: content_hero → table: content_hero
  📦 Batch 1/2 (100 rows)...
  ✅ Batch inserted successfully
  📦 Batch 2/2 (50 rows)...
  ✅ Batch inserted successfully
✅ Sheet content_hero complete: 150 success, 0 errors

🎉 Import complete!
   ✅ Success: 450 rows
   ❌ Errors: 0 rows
```

### 5. Перевірка

Відкрийте ваш сайт і перевірте контент!

---

## 🎯 Performance Tips

| Розмір файлу | Рекомендований метод | Швидкість |
|--------------|---------------------|-----------|
| < 500 rows | `import-simple.js` | 30 сек |
| 500-5000 rows | `import-xlsx-to-supabase.js` | 2-5 хв |
| > 5000 rows | SQL generation (`--sql`) | 1-2 хв |

**Збільшити швидкість:**

```javascript
// У import-xlsx-to-supabase.js
batchSize: 500  // замість 100
```

---

## ❓ FAQ

**Q: Чи втратяться існуючі дані?**  
A: Тільки якщо використаєте `--clear`. Без цієї опції існуючі дані залишаться.

**Q: Що робить `--upsert`?**  
A: Оновлює існуючі records по `id`, додає нові якщо `id` не існує.

**Q: Скільки часу займе імпорт 10,000 rows?**  
A: ~5 хвилин через script, ~1 хвилина через SQL метод.

**Q: Підтримуються українські символи?**  
A: Так, якщо файл збережений у UTF-8.

**Q: Чи можна імпортувати тільки одну таблицю?**  
A: Так, видаліть інші sheets з XLSX перед імпортом.

**Q: Що робити якщо є помилки?**  
A: Запустіть `npm run import:validate` - покаже всі проблеми.

---

## 🎉 Готово до роботи!

Усі інструменти готові. Просто:

```bash
npm install xlsx
npm run import:validate your-file.xlsx
npm run import your-file.xlsx
```

**Успіхів з імпортом! 🚀**

---

## 📞 Потрібна допомога?

1. Перевірте **XLSX_IMPORT_README.md** (найдетальніший гайд)
2. Запустіть `npm run import:validate` для діагностики
3. Перегляньте приклади у **XLSX_IMPORT_QUICKSTART.md**
4. Перевірте структуру у **XLSX_TEMPLATE_STRUCTURE.md**
