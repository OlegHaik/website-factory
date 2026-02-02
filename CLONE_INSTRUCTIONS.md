# Інструкція клонування проекту для нового клієнта

## Виконані клонування

| Клієнт | GitHub | Supabase URL | Дата |
|--------|--------|--------------|------|
| Amirlevi23 | https://github.com/Amirlevi23/websitefactory | https://ltscwrrknaayucekmwfb.supabase.co | 2026-02-02 |
| OlegHaik | https://github.com/OlegHaik/website-factory | https://gldkzldggcbubthygvwz.supabase.co | 2026-02-02 |

---

## Процедура клонування

### Крок 1: Push на новий GitHub

```bash
# Змінити remote на новий репозиторій
git remote remove origin
git remote add origin https://github.com/NEW-USER/NEW-REPO.git

# Push
git push -u origin main
```

**Примітка:** Якщо помилка 403 - потрібно додати collaborator або використати токен.

### Крок 2: Створити Supabase проект

1. https://supabase.com/dashboard → New Project
2. Зачекати поки створюється (~2 хв)
3. Скопіювати ключі з Settings → API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Крок 3: Створити таблиці в Supabase

Запустити в **SQL Editor** два файли по черзі:

1. `supabase_export/FULL_SCHEMA.sql` - основні таблиці
2. `supabase_export/ADD_ALL_MISSING_TABLES.sql` - додаткові таблиці (13 шт)

### Крок 4: Оновити .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=https://NEW-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=new-anon-key
SUPABASE_SERVICE_ROLE_KEY=new-service-role-key
```

### Крок 5: Імпорт даних

```bash
node IMPORT_TO_NEW_SUPABASE.js
```

Очікуваний результат: **2545 записів**

### Крок 6: Vercel

1. https://vercel.com/new → Import repository
2. Додати Environment Variables (3 ключі Supabase)
3. Додати `NEXT_PUBLIC_SITE_SLUG=bayonne` для тестування
4. Deploy

---

## Структура даних

### Основні таблиці (FULL_SCHEMA.sql)
- sites (692)
- styles (6)
- content_hero_new (16)
- content_header_new (16)
- content_cta_new (16)
- content_faq_new (192)
- content_testimonials_new (100)
- content_meta_new (176)
- content_services_new (96)
- content_home_article (146)
- content_feedback (64)
- content_legal (32)

### Додаткові таблиці (ADD_ALL_MISSING_TABLES.sql)
- config_styles (160) - theme presets
- content_blocks (270) - universal blocks
- content_meta (176) - SEO meta
- content_service_pages (96) - service pages
- content_service_area (16) - area pages
- content_questionnaire (10) - forms
- content_seo_body (11) - SEO content
- content_hero (16) - legacy
- content_header (16) - legacy
- content_cta (16) - legacy
- content_faq (192) - legacy
- content_testimonials (100) - legacy
- content_services (96) - legacy

---

## Оригінальна база (для експорту)

```
URL: https://yxtdgkdwydmvzgbibrrv.supabase.co
Service Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4dGRna2R3eWRtdnpnYmlicnJ2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTMyOTk1MywiZXhwIjoyMDgwOTA1OTUzfQ.lOnRr29ttWy0sgmcfvDIK0xqrUAdnrEaZHywgDt35TA
```

---

## Файли для клонування

```
supabase_export/
├── FULL_SCHEMA.sql           # Основна схема
├── ADD_ALL_MISSING_TABLES.sql # Додаткові таблиці
├── sites.json                 # 692 сайтів
├── styles.json                # 6 стилів
├── config_styles.json         # 160 themes
├── content_blocks.json        # 270 blocks
├── content_*.json             # Контент таблиці
└── README_CLONE.md            # Коротка інструкція

IMPORT_TO_NEW_SUPABASE.js      # Скрипт імпорту
```
