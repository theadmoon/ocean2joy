# TASK #012.1: ОБНОВЛЕНИЕ ДАННЫХ SERVICES В БАЗЕ ДАННЫХ

**Статус**: 🔴 КРИТИЧЕСКАЯ ОШИБКА В TASK #012  
**Приоритет**: 🔴🔴 P0+ (БЛОКИРУЕТ ПРИЁМКУ TASK #012)  

---

## 🎯 ПРОБЛЕМА

Task #012 исправила **только стили и атрибуты** Services Overview, НО **НЕ обновила данные сервисов в базе**.  

**Текущие данные в O2J2** (НЕПРАВИЛЬНЮЕ):
- "Custom Video Production **with Actors**"
- "Professional Video Editing **& Special Effects**"
- "AI-Generated Video **Content**"
- $25/min, From $10.99, From $20

**Должны быть (из прототипа)**:
- "Custom Video Production" (без "with Actors")
- "Video Editing" (без "Professional ... & Special Effects")
- "AI-Generated Video" (без "Content")
- From $1050, From $500, From $750

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

**СЕРВИС #1: Custom Video Production**

```javascript
db.services.updateOne(
  { type: "custom_video" },
  {
    $set: {
      "title": "Custom Video Production",
      "description": "Full-service video production from concept to final cut. Our team handles scripting, filming, editing, and post-production.",
      "pricing_model": "custom",
      "base_price": 1050,
      "price_description": "Starting at $1050, full project pricing based on scope and duration"
    }
  }
)
```

**СЕРВИС #2: Video Editing**

```javascript
db.services.updateOne(
  { type: "video_editing" },
  {
    $set: {
      "title": "Video Editing",
      "description": "Professional post-production services including color grading, sound design, motion graphics, and visual effects.",
      "pricing_model": "custom",
      "base_price": 500,
      "price_description": "Starting at $500, pricing based on project complexity and duration"
    }
  }
)
```

**СЕРВИС #3: AI-Generated Video**

```javascript
db.services.updateOne(
  { type: "ai_video" },
  {
    $set: {
      "title": "AI-Generated Video",
      "description": "Cutting-edge AI-powered video creation. Transform your ideas into stunning visual content with machine learning.",
      "pricing_model": "custom",
      "base_price": 750,
      "price_description": "Starting at $750, pricing varies based on video length and complexity"
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
    "title": "Custom Video Production",
    "base_price": 1050,
    "pricing_model": "custom",
    "price_description": "Starting at $1050, full project pricing based on scope and duration"
  },
  {
    "_id": "...",
    "title": "Video Editing",
    "base_price": 500,
    "pricing_model": "custom",
    "price_description": "Starting at $500, pricing based on project complexity and duration"
  },
  {
    "_id": "...",
    "title": "AI-Generated Video",
    "base_price": 750,
    "pricing_model": "custom",
    "price_description": "Starting at $750, pricing varies based on video length and complexity"
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