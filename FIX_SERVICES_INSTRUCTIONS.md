# КРИТИЧНЕ ВИПРАВЛЕННЯ - ВІДСУТНЯ ТАБЛИЦЯ content_services_new

## Проблема
Таблиця `content_services_new` не існує в базі даних, тому services не відображаються (показують "p" замість назв) і дають 404.

## Рішення

### Крок 1: Створіть таблицю в Supabase

1. Відкрийте Supabase Dashboard: https://supabase.com/dashboard/project/yxtdgkdwydmvzgbibrrv/editor
2. Перейдіть в SQL Editor (ліва панель)
3. Створіть New Query
4. Скопіюйте вміст файлу `FIX_CREATE_SERVICES_TABLE.sql`
5. Натисніть "Run"
6. Перевірте, що з'явився результат з 1 рядком (table_name: content_services_new)

### Крок 2: Імпортуйте дані

Після створення таблиці запустіть:

```bash
node import-master-full.js
```

Це імпортує:
- 96 services (6 на кожну категорію)
- 16 hero sections
- 16 menu/header configs
- 16 CTA sections
- 192 FAQ items
- 100 testimonials
- 176 meta tags

### Крок 3: Перевірте результат

```bash
node -e "require('dotenv').config({path: '.env.local'}); const { createClient } = require('@supabase/supabase-js'); const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); s.from('content_services_new').select('category, service_name').limit(10).then(r => console.log(JSON.stringify(r.data, null, 2)))"
```

## Чому це сталося

Таблиця `content_services_new` не була створена під час попередньої міграції. Ви виконували SQL для інших таблиць (_new), але ця залишилася пропущеною.

## Після виправлення

Після успішного імпорту:
1. Services матимуть правильні назви (не "p")
2. Сторінки services будуть відображатися (не 404)
3. Кожна категорія матиме свої 6 унікальних services
4. Спінтекст буде правильно працювати для кожної категорії
