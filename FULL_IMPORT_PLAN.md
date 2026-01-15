# 🎯 План повного імпорту MASTER_SPINTEXT

## ✅ Що робимо:
Використовуємо **ВСІ дані** з MASTER_SPINTEXT (192 FAQ, 100 testimonials, 96 services, etc.)

---

## 📋 Покроковий план:

### Крок 1: Створити нові таблиці ⚙️

**У Supabase SQL Editor виконайте:**

```sql
-- Відкрийте файл MIGRATION_new_structure.sql
-- Скопіюйте і виконайте SQL для створення нових таблиць
```

**Що створить:**
- `content_faq_new` - для всіх FAQ (12 на категорію × 16 = 192 rows)
- `content_testimonials_new` - для всіх відгуків (15 на категорію × 16 = 240 rows max)
- `content_services_new` - для всіх послуг (6 на категорію × 16 = 96 rows)

---

### Крок 2: Імпортувати дані в нові таблиці 📥

```bash
node import-full-master-spintext.js "MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx"
```

**Що станеться:**
```
📥 ПОВНИЙ імпорт MASTER_SPINTEXT

📄 Файл: MASTER_SPINTEXT_ALL CATEGORIES_FINAL.xlsx
🗄️  Таблиці: НОВІ (_new)

📊 Обробка: HERO → content_hero_new
   Знайдено: 16 рядків
   Трансформовано: 16 рядків
   ✅ Успішно: 16, Помилок: 0

📊 Обробка: MENU → content_header_new
   Знайдено: 1600 рядків
   Відфільтровано до: 16 рядків
   Трансформовано: 16 рядків
   ✅ Успішно: 16, Помилок: 0

📊 Обробка: FAQ → content_faq_new
   Знайдено: 192 рядків
   Трансформовано: 192 рядків
   ✅ Успішно: 192, Помилок: 0

📊 Обробка: TESTIMONIALS → content_testimonials_new
   Знайдено: 100 рядків
   Трансформовано: 100 рядків
   ✅ Успішно: 100, Помилок: 0

📊 Обробка: SERVICES_GRID → content_services_new
   Знайдено: 96 рядків
   Трансформовано: 96 рядків
   ✅ Успішно: 96, Помилок: 0

🎉 Імпорт завершено!
✅ Успішно імпортовано: 420+ рядків
```

---

### Крок 3: Перевірити імпортовані дані ✓

```bash
# Перевірити кількість
node -e "
require('dotenv').config({ path: '.env.local' });
const {createClient} = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
  const tables = ['content_faq_new', 'content_testimonials_new', 'content_services_new'];
  for (const table of tables) {
    const {count} = await supabase.from(table).select('*', {count: 'exact', head: true});
    console.log(\`\${table}: \${count} rows\`);
  }
})();
"
```

**Очікуємо:**
```
content_faq_new: 192 rows
content_testimonials_new: 100 rows
content_services_new: 96 rows
```

---

### Крок 4: Оновити код для читання нових таблиць 🔧

**Файли які треба оновити:**

#### `lib/fetch-content.ts`

Замінити функції на нові структури:

```typescript
// FAQ - нова структура
export async function getContentFAQ(category: string) {
  const { data } = await supabase
    .from('content_faq')
    .select('*')
    .eq('category', category)
    .order('faq_id')
  
  // Групуємо питання та відповіді
  const faqs = []
  for (let i = 0; i < data.length; i += 2) {
    const question = data[i]
    const answer = data[i + 1]
    if (question && answer) {
      faqs.push({
        question: question.content,
        answer: answer.content
      })
    }
  }
  
  return faqs
}

// Testimonials - нова структура
export async function getContentTestimonials(category: string) {
  const { data } = await supabase
    .from('content_testimonials')
    .select('*')
    .eq('category', category)
    .order('testimonial_num')
    .limit(3) // Показуємо перші 3
  
  return data?.map(t => ({
    name: t.testimonial_name,
    text: t.testimonial_body,
    rating: t.rating
  })) || []
}

// Services - нова структура
export async function getContentServices(category: string) {
  const { data } = await supabase
    .from('content_services')
    .select('*')
    .eq('category', category)
    .order('service_id')
  
  return data?.map(s => ({
    id: s.service_id,
    name: s.service_name,
    nameSpin: s.service_name_spin,
    slug: s.service_slug,
    description: s.svc_grid_desc
  })) || []
}
```

---

### Крок 5: Перейменувати таблиці на production 🔄

**Коли все працює - виконайте в SQL Editor:**

```sql
-- Backup старих таблиць
ALTER TABLE content_faq RENAME TO content_faq_old_backup;
ALTER TABLE content_testimonials RENAME TO content_testimonials_old_backup;
ALTER TABLE content_services RENAME TO content_services_old_backup;

-- Активувати нові таблиці
ALTER TABLE content_faq_new RENAME TO content_faq;
ALTER TABLE content_testimonials_new RENAME TO content_testimonials;
ALTER TABLE content_services_new RENAME TO content_services;

-- Додати RLS policies
ALTER TABLE content_faq ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON content_faq FOR SELECT USING (true);

ALTER TABLE content_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON content_testimonials FOR SELECT USING (true);

ALTER TABLE content_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON content_services FOR SELECT USING (true);
```

---

### Крок 6: Тестування 🧪

```bash
# Запустити dev
npm run dev

# Перевірити:
# 1. Homepage показує FAQ (всі 6 питань)
# 2. Testimonials відображаються
# 3. Services grid працює
# 4. Спінтекст обробляється правильно
```

---

## 🚨 Rollback (якщо щось не так)

```sql
-- Видалити нові таблиці
DROP TABLE IF EXISTS content_faq;
DROP TABLE IF EXISTS content_testimonials;
DROP TABLE IF EXISTS content_services;

-- Повернути старі
ALTER TABLE content_faq_old_backup RENAME TO content_faq;
ALTER TABLE content_testimonials_old_backup RENAME TO content_testimonials;
ALTER TABLE content_services_old_backup RENAME TO content_services;
```

---

## ✅ Checklist

Перед початком:
- [ ] Backup існуючих даних (вже є: `supabase-export-1768436149990.xlsx`)
- [ ] SQL міграція готова (`MIGRATION_new_structure.sql`)
- [ ] Імпорт скрипт готовий (`import-full-master-spintext.js`)

Виконання:
- [ ] Створені нові таблиці (_new)
- [ ] Імпортовані всі дані в _new таблиці
- [ ] Перевірена кількість rows
- [ ] Оновлений код для читання
- [ ] Протестовано на dev
- [ ] Перейменовані таблиці на production

Після:
- [ ] Сайт працює
- [ ] Всі дані відображаються
- [ ] Спінтекст працює
- [ ] Видалені backup таблиці (через тиждень)

---

## 🎯 Готові почати?

1. Відкрийте Supabase SQL Editor
2. Виконайте `MIGRATION_new_structure.sql`
3. Запустіть `node import-full-master-spintext.js`

**Поїхали! 🚀**
