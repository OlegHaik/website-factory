# ВИРІШЕННЯ ПРОБЛЕМИ З SERVICES ВІДОБРАЖЕННЯМ

## Проблема
Services відображаються як "p" і при переході дають 404 помилку.

## Причина
Дані з таблиці `content_services_new` не доступні через Supabase PostgREST API з причин RLS (Row Level Security). 

## Знайдені факти
1. ✅ Таблиця `content_services_new` існує в БД (16 рядків)
2. ✅ Таблиця `content_service_pages` існує і має 72 записи
3. ❌ PostgREST не бачить `content_services_new` (error: "Could not find the table in schema cache")
4. ✅ `content_service_pages` видима і доступна

## Виправлення (ВЖЕ ЗРОБЛЕНО)

### 1. Виправлено код для використання `content_service_pages`
Файл: `lib/fetch-content.ts`
```typescript
// Тепер використовує content_service_pages замість content_services_new
export async function getContentServicesNew(category: string = "water_damage"): Promise<ContentServiceNew[]> {
  const { data, error } = await supabase
    .from("content_service_pages")  // ЗМІНЕНО
    .select("service_slug, service_title_spintax, service_description_spintax, hero_subheadline_spintax")
    .eq("category", normalizedCategory)
}
```

### 2. Видалено невикористані імпорти
- Видалено `parseFAQItems` з `app/page.tsx`
- Видалено `LegacyFieldMap` з `lib/category-mapping.ts`

## Що потрібно зробити в Supabase (КРИТИЧНО)

### Варіант А: Додати RLS політику для content_services_new

Виконайте в Supabase SQL Editor:

```sql
-- Дозволити публічний read доступ до content_services_new
CREATE POLICY "Allow public read on content_services_new" 
ON content_services_new 
FOR SELECT 
USING (true);

-- Оновити схему PostgREST
NOTIFY pgrst, 'reload schema';
```

### Варіант Б: Використовувати тільки content_service_pages (ПОТОЧНЕ РІШЕННЯ)

Код вже виправлено для цього варіанта. Переконайтесь, що RLS політика є:

```sql
-- Перевірити існуючі політики
SELECT * FROM pg_policies WHERE tablename = 'content_service_pages';

-- Якщо немає, додати:
CREATE POLICY "Allow public read on content_service_pages" 
ON content_service_pages 
FOR SELECT 
USING (true);
```

## Перевірка

Запустіть діагностичний скрипт:
```bash
node diagnose-services.js
```

Очікуваний результат після виправлення:
```
✅ content_service_pages: 72 rows
✅ water_damage: 6 services
   - biohazard-cleanup: Biohazard Cleanup
   - burst-pipe-repair: Burst Pipe Repair
   ... і т.д.
```

## Статус
- ✅ Код виправлено
- ✅ TypeScript помилки виправлено  
- ✅ Build успішний
- ✅ Закомічено та запушено
- ⏳ Деплой на Vercel (автоматично після push)
- ⚠️ RLS політики в Supabase (потребує перевірки)

## Наступні кроки
1. Дочекатись деплою на Vercel
2. Перевірити чи services відображаються правильно
3. Якщо ні - виконати SQL з Варіанту А або Б в Supabase
4. Перезапустити деплой на Vercel якщо потрібно

## Додаткова інформація

### Структура даних
- `content_service_pages` містить ВСІ дані для service сторінок
- `content_services_new` містить тільки базову інформацію (name, slug, description)
- Поточне рішення використовує `content_service_pages` як єдине джерело даних

### Категорії та їх services
- **water_damage**: 6 services (biohazard-cleanup, burst-pipe-repair, fire-smoke-damage, mold-remediation, sewage-cleanup, water-damage-restoration)
- **roofing**: 6 services (commercial-roofing, emergency-leak-repair, metal-roofing, roof-installation, roof-repair, shingle-roofing)
- **mold_remediation**: 6 services
- **plumbing**: 6 services
- **Інші категорії**: також по 6 services кожна
