# TASK #012.1: ОБНОВЛЕНИЕ ДАННЫХ SERVICES В БАЗЕ ДАННЫХ

**Статус**: 🔴 КРИТИЧЕСКАЯ ОШИБКА В TASK #012  
**Приоритет**: 🔴🔴 P0+ (БЛОКИРУЕТ ПРИЁМКУ TASK #012)  

---

## 🎯 ПРОБЛЕМА

Task #012 исправила **только стили и атрибуты** Services Overview, НО **НЕ обновила данные сервисов в базе**.  

**Текущие данные в O2J2** (могут отличаться от прототипа):
- Требуется обновление

**Должны быть (ТОЧНЫЕ данные из прототипа Ocean2Joy API `/api/services`)**:
- "Custom Video Production with Actors"
- "Professional Video Editing & Special Effects"
- "AI-Generated Video Content"
- Цены: $25.0 (per_minute), $10.99 (per_project), $20.0 (custom)
- Описания: см. MongoDB команды ниже

---

## 📝 ДИРЕКТИВА: ОБНОВИТЬ ДАННЫЕ В MONGODB

**ЧТО ДЕЛАТЬ**:

### ШАГ 1: ПРОВЕРИТЬ ТЕКУЩИЕ ДАННЫЕ

Запустить в MongoDB shell или MongoDB Compass:

```javascript
use ocean2joy_db
db.services.find({}, {title: 1, base_price: 1, pricing_model: 1, price_description: 1})
```

### ШАГ 2: ОБНОВИТЬ КАЖДЫЙ СЕРВИС

**СЕРВИС #1: Custom Video Production with Actors**

```javascript
db.services.updateOne(
  { type: "custom_video" },
  {
    $set: {
      "title": "Custom Video Production with Actors",
      "description": "Professional video production with real actors, custom scripts, and high-quality filming. Perfect for commercials, short films, educational content, and brand stories.",
      "pricing_model": "per_minute",
      "base_price": 25.0,
      "price_description": "$25-35 per minute, calculated based on duration and complexity"
    }
  }
)
```

**СЕРВИС #2: Professional Video Editing & Special Effects**

```javascript
db.services.updateOne(
  { type: "video_editing" },
  {
    $set: {
      "title": "Professional Video Editing & Special Effects",
      "description": "Expert video editing and post-production services for your existing footage. From basic cuts to advanced special effects and motion graphics.",
      "pricing_model": "per_project",
      "base_price": 10.99,
      "price_description": "Starting at $10.99 per element, full project pricing calculated based on complexity"
    }
  }
)
```

**СЕРВИС #3: AI-Generated Video Content**

```javascript
db.services.updateOne(
  { type: "ai_video" },
  {
    $set: {
      "title": "AI-Generated Video Content",
      "description": "Cutting-edge AI-powered video creation with digital characters and environments. Perfect for creative projects, explainer videos, and unique visual content.",
      "pricing_model": "custom",
      "base_price": 20.0,
      "price_description": "Custom pricing based on video length, complexity, and AI features used"
    }
  }
)
```

### ШАГ 3: ПРОВЕРИТЬ РЕЗУЛЬТАТ

```javascript
db.services.find({}, {title: 1, base_price: 1, pricing_model: 1, price_description: 1})
```

**ОЖИДАЕМЫЙ РЕЗУЛЬТАТ**:

```json
[
  {
    "_id": "...",
    "title": "Custom Video Production with Actors",
    "base_price": 25.0,
    "pricing_model": "per_minute",
    "price_description": "$25-35 per minute, calculated based on duration and complexity"
  },
  {
    "_id": "...",
    "title": "Professional Video Editing & Special Effects",
    "base_price": 10.99,
    "pricing_model": "per_project",
    "price_description": "Starting at $10.99 per element, full project pricing calculated based on complexity"
  },
  {
    "_id": "...",
    "title": "AI-Generated Video Content",
    "base_price": 20.0,
    "pricing_model": "custom",
    "price_description": "Custom pricing based on video length, complexity, and AI features used"
  }
]
```

---

## ✅ ЧЕКЛИСТ ДЛЯ ИСПОЛНИТЕЛЯ

- [ ] Обновлён сервис "Custom Video Production" (title, description, base_price, pricing_model, price_description)
- [ ] Обновлён сервис "Video Editing"
- [ ] Обновлён сервис "AI-Generated Video"
- [ ] Проверено через MongoDB shell/Compass
- [ ] Предоставлен скриншот homepage с обновлёнными данными

---

## 📦 ФАЙЛЫ ДЛЯ ОТЧЁТА

1. **SCREENSHOTS** (ОБЯЗАТЕЛЬНО!):
   - `services_data_updated.png` — Services Overview с новыми данными (Custom Video Production, Video Editing, AI-Generated Video, From $1050, From $500, From $750)

2. **COMPLETION_REPORT.md** — Отчёт о выполнении с командами MongoDB, которые были использованы.

---

## 🚨 ANTI-CHECKLIST (НЕ ДЕЛАЙ!)

- ❌ НЕ меняй `image_url` — картинки в O2J2 более удачные
- ❌ НЕ удаляй сервисы, только обновляй (`updateOne`, НЕ `deleteMany`)
- ❌ НЕ меняй `id`, `type` — только `title`, `description`, `base_price`, `pricing_model`, `price_description`

---

**ЭТО КРИТИЧЕСКАЯ ЗАДАЧА! Task #012 не может быть принята без этого исправления.**