# 🎯 План якісного імпорту MASTER_SPINTEXT

## ✅ Що ми маємо:

### Ваш XLSX файл:
- **Файл**: MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx (217 KB)
- **16 категорій**: water_damage, mold_remediation, roofing, chimney, kitchen_remodel, etc.
- **13 sheets**: HERO, MENU, SERVICES_GRID, FAQ, TESTIMONIALS, CTA, etc.
- **Структура відрізняється** від Supabase schema

### Ваша Supabase БД:
- **Таблиці**: content_hero, content_header, content_services, etc.
- **Структура**: id, category, xxx_spintax колонки
- **Можливо вже є дані** (потрібно перевірити)

---

## 📝 Покроковий план (ЯКІСНО):

### Крок 1: Налаштування підключення ⚙️

**Що треба:**
1. Відкрити Supabase Dashboard: https://supabase.com/dashboard
2. Вибрати ваш проект
3. Settings → API
4. Скопіювати:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (для імпорту!)

**Вставити в `.env.local`:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # ⚠️ Цей ключ НЕ commitити!
```

**Перевірка:**
```bash
npm run db:check
```

---

### Крок 2: Аналіз поточного стану БД 🔍

**Команда:**
```bash
npm run db:check
```

**Що покаже:**
- Які таблиці порожні ✅
- Які таблиці мають дані ⚠️
- Скільки rows в кожній
- Максимальні ID

**Приклад виводу:**
```
content_hero           ✅ Empty
content_header         ⚠️  30 rows   Max ID: 72
content_services       ⚠️  16 rows   Max ID: 16
```

**Рішення залежно від результату:**

**Варіант A**: Всі таблиці порожні
→ Можна імпортувати без побоювань

**Варіант B**: Є дані в деяких таблицях
→ Треба вирішити:
  - Зберегти існуючі? (backup + upsert)
  - Замінити все? (--clear)
  - Імпортувати тільки порожні?

---

### Крок 3: Backup існуючих даних (якщо є) 💾

**Якщо є дані в БД:**

```bash
npm run db:export
```

Створить файл: `supabase-export-[timestamp].xlsx`

**АБО через Supabase Dashboard:**
- Database → Backups → Create Manual Backup

---

### Крок 4: Фінальна перевірка mapping 🗺️

**Перевіримо що mapping правильний:**

```bash
# Проаналізуємо структуру
node analyze-xlsx.js "MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx"
```

**Перевіримо зразок даних які будуть імпортовані:**

```bash
node -e "
const XLSX = require('xlsx');
const wb = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');

// HERO sheet
const hero = XLSX.utils.sheet_to_json(wb.Sheets['HERO']);
console.log('HERO → content_hero:');
console.log('  Буде імпортовано:', hero.length, 'rows');
console.log('  Приклад:', {
  id: hero[0].category_id,
  category: hero[0].category,
  headline_spintax: hero[0].hero_h1.substring(0, 50) + '...',
  subheadline_spintax: hero[0].hero_sub.substring(0, 50) + '...'
});

// MENU sheet
const menu = XLSX.utils.sheet_to_json(wb.Sheets['MENU']);
console.log('\nMENU → content_header:');
console.log('  Всього варіацій:', menu.length);
console.log('  Унікальних категорій:', [...new Set(menu.map(r => r.category))].length);
console.log('  Буде імпортовано: перша варіація кожної категорії');
"
```

---

### Крок 5: Тестовий dry-run (без вставки) 🧪

**Модифікуємо скрипт для dry-run:**

Створимо тестову версію:

```bash
node -e "
const XLSX = require('xlsx');
const wb = XLSX.readFile('MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx');

console.log('🧪 DRY RUN - що буде імпортовано:\n');

const sheets = ['HERO', 'MENU', 'CTA', 'FAQ', 'TESTIMONIALS', 'META'];

sheets.forEach(sheet => {
  const ws = wb.Sheets[sheet];
  if (!ws) {
    console.log(\`❌ \${sheet} - не знайдено\`);
    return;
  }
  
  const data = XLSX.utils.sheet_to_json(ws);
  console.log(\`✅ \${sheet}:\`);
  console.log(\`   Rows: \${data.length}\`);
  console.log(\`   Категорії: \${[...new Set(data.map(r => r.category))].length}\`);
});
"
```

---

### Крок 6: Імпорт з підтвердженням ✅

**Фінальний імпорт:**

```bash
# Варіант 1: Якщо БД порожня
node import-master-spintext.js "MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx"

# Варіант 2: Якщо є дані - з upsert (оновить існуючі)
node import-master-spintext.js "MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx" --upsert

# Варіант 3: Замінити все (НЕБЕЗПЕЧНО!)
node import-master-spintext.js "MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx" --clear
```

**Що відбудеться:**
```
📥 Custom XLSX Import

📄 File: MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx

📊 Processing: HERO → content_hero
   Found 16 rows
   Transformed 16 rows
   ✅ Imported: 16, ❌ Failed: 0

📊 Processing: MENU → content_header
   Found 1600 rows
   Filtered to 16 unique categories
   Transformed 16 rows
   ✅ Imported: 16, ❌ Failed: 0

...

🎉 Import complete!
   ✅ Total success: 150 rows
   ❌ Total errors: 0 rows
```

---

### Крок 7: Верифікація результату ✓

**Перевірка:**

```bash
npm run db:check
```

**Має показати:**
```
content_hero           ⚠️  16 rows   Max ID: 16
content_header         ⚠️  16 rows   Max ID: 72
content_services       ⚠️  16 rows   Max ID: 16
...
```

**Перевірка даних:**

```bash
node -e "
const {createClient} = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  const {data} = await supabase.from('content_hero').select('*').limit(3);
  console.log('Перші 3 рядки content_hero:');
  console.log(JSON.stringify(data, null, 2));
})();
"
```

---

### Крок 8: Тестування на сайті 🌐

**Запустіть dev сервер:**

```bash
npm run dev
```

**Перевірте:**
- Homepage відображає контент зі спінтексту
- Різні категорії показують різний контент
- Змінні {{city}}, {{phone}} замінюються правильно

---

## 🛡️ Safety Checklist

Перед імпортом:
- [ ] ✅ `.env.local` створений з правильними ключами
- [ ] ✅ `npm run db:check` працює
- [ ] ✅ Зроблений backup існуючих даних (якщо є)
- [ ] ✅ Перевірений mapping скрипт
- [ ] ✅ Запущений dry-run
- [ ] ✅ Є план rollback (backup файл)

Після імпорту:
- [ ] ✅ `npm run db:check` показує правильну кількість rows
- [ ] ✅ Дані в БД виглядають коректно
- [ ] ✅ Сайт працює і показує контент
- [ ] ✅ Спінтекст обробляється правильно

---

## 🚨 Rollback план

**Якщо щось пішло не так:**

1. **Є backup файл:**
   ```bash
   node import-master-spintext.js supabase-export-[timestamp].xlsx --clear --upsert
   ```

2. **Є Supabase backup:**
   - Dashboard → Database → Backups → Restore

3. **Видалити імпортовані дані:**
   ```sql
   -- У Supabase SQL Editor
   DELETE FROM content_hero WHERE id <= 16;
   DELETE FROM content_header WHERE id <= 72;
   -- etc.
   ```

---

## 📞 Наступні кроки

**Зараз треба:**

1. **Заповнити `.env.local`** вашими Supabase credentials
2. **Запустити `npm run db:check`** щоб побачити стан БД
3. **Показати мені результат** - і я скажу як далі діяти

**Готові розпочати? Заповніть `.env.local` і запустіть перевірку! 🎯**
