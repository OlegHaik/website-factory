# Інструкція клонування проекту

## Крок 1: Створення нового GitHub репозиторію

### Варіант A: Через GitHub веб-інтерфейс
1. Зайдіть на https://github.com/new
2. Назвіть репозиторій (наприклад: `client-water-damage-website`)
3. Оберіть **Private** або **Public**
4. НЕ додавайте README, .gitignore чи license
5. Натисніть **Create repository**

### Варіант B: Через командний рядок
```bash
# Встановіть GitHub CLI якщо ще не встановлено
# https://cli.github.com/

gh repo create YOUR-USERNAME/client-water-damage-website --private --source=. --remote=client
```

## Крок 2: Push коду в новий репозиторій

```bash
# Видаліть старий remote origin (якщо потрібно)
git remote remove origin

# Додайте новий remote
git remote add origin https://github.com/YOUR-USERNAME/NEW-REPO-NAME.git

# Push всіх гілок
git push -u origin main
```

## Крок 3: Створення нового Supabase проекту

1. Зайдіть на https://supabase.com/dashboard
2. Натисніть **New Project**
3. Оберіть організацію
4. Введіть назву проекту
5. Встановіть пароль для БД
6. Оберіть регіон (рекомендую той же, що і для Vercel)
7. Натисніть **Create new project**
8. Зачекайте поки проект створюється (~2 хвилини)

## Крок 4: Створення таблиць в новому Supabase

1. В дашборді Supabase перейдіть в **SQL Editor**
2. Натисніть **New query**
3. Скопіюйте вміст файлу `FULL_SCHEMA.sql` і вставте
4. Натисніть **Run**

## Крок 5: Отримання ключів API

1. В Supabase дашборді перейдіть в **Settings > API**
2. Скопіюйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## Крок 6: Оновлення .env.local

Замініть в файлі `.env.local` старі ключі на нові:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-NEW-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-new-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key
```

## Крок 7: Імпорт даних

```bash
node IMPORT_TO_NEW_SUPABASE.js
```

## Крок 8: Налаштування Vercel

1. Зайдіть на https://vercel.com/new
2. Імпортуйте новий репозиторій
3. Додайте Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

## Перевірка

Після деплою перевірте:
- [ ] Головна сторінка завантажується
- [ ] Дані з БД відображаються
- [ ] Всі сторінки працюють

## Файли в цій папці

| Файл | Опис |
|------|------|
| `FULL_SCHEMA.sql` | SQL для створення всіх таблиць |
| `ALL_DATA.json` | Всі дані в одному файлі |
| `sites.json` | Дані таблиці sites (692 записів) |
| `styles.json` | Стилі (6 записів) |
| `content_*.json` | Контент таблиці |

## Статистика експорту

- **sites**: 692 записів
- **styles**: 6 записів
- **content_hero_new**: 16 записів
- **content_header_new**: 16 записів
- **content_cta_new**: 16 записів
- **content_faq_new**: 192 записів
- **content_testimonials_new**: 100 записів
- **content_meta_new**: 176 записів
- **content_services_new**: 96 записів
- **content_home_article**: 146 записів
- **content_feedback**: 64 записів
- **content_legal**: 32 записів

**Всього: 1552 записів**
