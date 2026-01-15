# 📝 XLSX Template Guide

## Структура файлу для імпорту

Цей документ описує точну структуру XLSX файлу, який потрібен для імпорту спінтексту.

---

## 📊 Sheet 1: content_hero

**Призначення**: Головна hero секція на homepage

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| headline_spintax | text | ✅ | {Emergency\|24/7\|Fast} Water Damage {Restoration\|Service} in {{city}} |
| subheadline_spintax | text | ✅ | We {restore\|repair\|fix} your property {quickly\|fast\|immediately} |
| chat_button_spintax | text | ❌ | {Chat With Us\|Message Us\|Contact Us} |

**Приклад рядка:**
```
id: 1
category: water_damage
headline_spintax: {Emergency|24/7|Rapid} Water Damage Restoration in {{city}}, {{state}}
subheadline_spintax: Professional {restoration|repair|recovery} services. We respond {within 60 minutes|immediately|fast}.
chat_button_spintax: {Email Us|Contact Us Today|Get Help Now}
```

---

## 📊 Sheet 2: content_header

**Призначення**: Навігаційне меню та header елементи

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| nav_home | text | ❌ | Home |
| nav_services | text | ❌ | {Services\|Our Services} |
| nav_areas | text | ❌ | {Service Areas\|Locations We Serve} |
| nav_contact | text | ❌ | {Contact\|Get Help\|Reach Us} |
| call_button_text | text | ❌ | {Call Now\|Call Us\|Contact Us} |
| our_links_spintax | text | ❌ | {Our Links\|Quick Links\|Resources} |

---

## 📊 Sheet 3: content_services

**Призначення**: Описи кожної послуги

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| water_title | text | ❌ | {Emergency\|24/7} Water Damage {Restoration\|Repair} |
| water_description | text | ❌ | Fast response to {floods\|water emergencies\|water damage}. We {restore\|repair\|fix} your property. |
| fire_title | text | ❌ | Fire Damage {Restoration\|Recovery} |
| fire_description | text | ❌ | Complete {fire\|smoke} damage {cleanup\|restoration}. |
| mold_title | text | ❌ | {Professional\|Expert} Mold {Remediation\|Removal} |
| mold_description | text | ❌ | Safe {mold removal\|remediation} by {certified\|licensed} technicians. |
| sewage_title | text | ❌ | Sewage {Cleanup\|Removal} |
| sewage_description | text | ❌ | {Safe\|Professional} sewage {cleanup\|removal} and {sanitization\|disinfection}. |

**Примітка**: Додайте стільки service columns, скільки потрібно

---

## 📊 Sheet 4: content_cta

**Призначення**: Call-to-action секція

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| headline_spintax | text | ✅ | {Need Help\|Emergency Service\|Get Help Now}? {Call\|Contact} {{business_name}} |
| subheadline_spintax | text | ✅ | {Available 24/7\|Round-the-clock service\|Always ready} for {emergencies\|your needs}. |
| chat_button_spintax | text | ❌ | {Chat With Us\|Message Us\|Get Quote} |

---

## 📊 Sheet 5: content_seo_body

**Призначення**: SEO-оптимізований текст для homepage

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| intro_spintax | text | ✅ | {{business_name}} provides {professional\|expert\|quality} water damage restoration in {{city}}, {{state}}. |
| why_choose_title_spintax | text | ✅ | Why Choose {Us\|{{business_name}}\|Our Team}? |
| why_choose_spintax | text | ✅ | We offer {fast response\|24/7 service\|certified technicians} and {quality work\|guaranteed results}. |
| process_title_spintax | text | ✅ | Our {Process\|Approach\|Method} |
| process_spintax | text | ✅ | {We inspect\|First, we assess} the damage, then {remove water\|extract moisture\|dry the area}, and finally {restore\|repair} your property. |

---

## 📊 Sheet 6: content_faq

**Призначення**: FAQ секція

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| heading_spintax | text | ✅ | {Frequently Asked Questions\|Common Questions\|FAQ} |
| items | JSON | ✅ | (див. нижче) |

**Формат колонки `items` (JSON):**
```json
[
  {
    "question_spintax": "How {fast|quickly} do you respond?",
    "answer_spintax": "We respond {within 60 minutes|immediately|very fast} to {emergencies|urgent calls}."
  },
  {
    "question_spintax": "Do you work with {insurance|insurance companies}?",
    "answer_spintax": "Yes, we {work with|assist with|handle} all major insurance companies."
  },
  {
    "question_spintax": "Are you {licensed|certified}?",
    "answer_spintax": "{Yes|Absolutely}, we are {fully licensed|certified|insured} and {experienced|qualified}."
  }
]
```

---

## 📊 Sheet 7: content_testimonials

**Призначення**: Відгуки клієнтів

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| heading_spintax | text | ✅ | What {Our Clients\|Customers} Say |
| subheading_spintax | text | ✅ | {Real reviews\|Testimonials} from {satisfied\|happy} customers |
| items | JSON | ✅ | (див. нижче) |

**Формат колонки `items` (JSON):**
```json
[
  {
    "name": "{Sarah|Jennifer|Michelle} {M|R|T}.",
    "location_spintax": "{{city}}, {{state}}",
    "text_spintax": "{They arrived fast|Quick response} and {explained everything|were very professional}. {Highly recommend|Would use again|Great service}!",
    "rating": 5
  },
  {
    "name": "John D.",
    "location_spintax": "{{city}}, {{state}}",
    "text_spintax": "{Professional team|Great crew} that {did excellent work|restored our home perfectly}. The {insurance process|paperwork} was {easy|handled smoothly}.",
    "rating": 5
  }
]
```

---

## 📊 Sheet 8: content_service_pages

**Призначення**: Індивідуальні сторінки для кожної послуги

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| service_slug | text | ✅ | water-damage-restoration |
| service_title_spintax | text | ❌ | {Emergency\|Professional} Water Damage Restoration |
| hero_headline_spintax | text | ❌ | Water Damage {Restoration\|Repair} in {{city}} |
| hero_subheadline_spintax | text | ❌ | {Fast\|24/7\|Emergency} water damage {restoration\|repair} services |
| section_headline_spintax | text | ❌ | {Our\|Professional} Water Damage Services |
| section_body_spintax | text | ❌ | We provide {complete\|comprehensive} water damage {restoration\|repair}... |
| process_headline_spintax | text | ❌ | Our {Process\|Approach} |
| process_body_spintax | text | ❌ | {First\|Step 1}, we {assess\|inspect} the damage... |

**Slug values для water_damage:**
- `water-damage-restoration`
- `fire-damage-restoration`
- `mold-remediation`
- `sewage-cleanup`
- `burst-pipe-repair`

---

## 📊 Sheet 9: content_service_area

**Призначення**: Сторінки для локацій (service areas)

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| headline_spintax | text | ❌ | {Professional\|Expert} Water Damage Restoration in {{city}} |
| paragraph1_spintax | text | ❌ | {{business_name}} provides {emergency\|24/7} restoration services... |
| paragraph2_spintax | text | ❌ | Our {certified\|experienced} technicians {respond quickly\|are available 24/7}... |
| why_city_headline_spintax | text | ❌ | Why Choose Us in {{city}}? |
| why_city_paragraph_spintax | text | ❌ | We {know\|understand} {{city}} and {serve\|work in} the {local community\|area}... |
| services_list_headline_spintax | text | ❌ | {Services\|What We Offer} in {{city}} |

---

## 📊 Sheet 10: content_blocks

**Призначення**: Structured content blocks (нова система)

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category_key | text | ✅ | water_damage |
| page_type | text | ✅ | home |
| section_key | text | ✅ | seo_body_article |
| element_type | text | ✅ | h2 |
| element_order | number | ✅ | 1 |
| global_order | number | ✅ | 1 |
| site_id | number | ❌ | (null для default) |
| value_spintax_html | text | ✅ | {Professional\|Expert} Water Damage Restoration |

**Element types:**
- `h1` - головний заголовок
- `h2` - підзаголовок
- `h3` - третій рівень
- `p` - параграф тексту
- `bullets` - bullet list (розділені новими рядками)
- `cta` - call to action

**Page types:**
- `home` - homepage
- `service` - service page
- `service_area` - location page

---

## 📊 Sheet 11: content_meta

**Призначення**: Meta tags для SEO

| Колонка | Тип | Обов'язкова | Приклад |
|---------|-----|-------------|---------|
| id | number | ✅ | 1 |
| category | text | ✅ | water_damage |
| page_type | text | ✅ | homepage |
| title_spintax | text | ❌ | {{business_name}} - {Emergency\|24/7} Water Damage Restoration in {{city}} |
| description_spintax | text | ❌ | {Professional\|Expert} water damage restoration in {{city}}, {{state}}. {Fast response\|24/7 service}. |

**Page type values:**
- `homepage`
- `service_page`
- `service_area_page`

---

## 🎨 Категорії (category values)

Використовуйте одну з цих категорій у колонці `category`:

- `water_damage` - Відновлення після води
- `roofing` - Покрівельні роботи
- `mold_remediation` - Видалення цвілі
- `plumbing` - Сантехніка
- `bathroom_remodel` - Ремонт ванної
- `kitchen_remodel` - Ремонт кухні
- `air_duct` - Чистка вентиляції
- `chimney` - Димарі
- `locksmith` - Слюсар
- `garage_door` - Гаражні ворота
- `adu_builder` - Будівництво ADU
- `pool_contractor` - Басейни

---

## 🔧 Змінні (доступні у спінтексті)

Ці змінні автоматично замінюються значеннями з таблиці `sites`:

| Змінна | Опис | Приклад |
|--------|------|---------|
| `{{city}}` | Місто | Miami |
| `{{state}}` | Штат | FL |
| `{{business_name}}` | Назва бізнесу | Miami Water Pros |
| `{{phone}}` | Телефон | (305) 555-1234 |

**Використання:**
```
{Emergency|24/7} service in {{city}}, {{state}}
→ "Emergency service in Miami, FL"

Call {{business_name}} at {{phone}}
→ "Call Miami Water Pros at (305) 555-1234"
```

---

## ✅ Чеклист перед імпортом

- [ ] Всі sheets мають правильні назви
- [ ] Перший рядок кожного sheet = назви колонок
- [ ] Обов'язкові колонки заповнені
- [ ] JSON колонки мають валідний JSON
- [ ] Category values правильні
- [ ] Спінтекст використовує правильний синтаксис `{option1|option2}`
- [ ] Змінні використовують правильний синтаксис `{{variable}}`
- [ ] Файл збережений у форматі .xlsx

---

## 🚀 Готово!

Після підготовки файлу запустіть:

```bash
# Перевірка
npm run import:validate your-file.xlsx

# Імпорт
npm run import your-file.xlsx
```
