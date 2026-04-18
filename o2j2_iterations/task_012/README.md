# TASK #012: Services Overview — Style & Attributes Fixes

**Цель**: Привести Services Overview в O2J2 к 100% визуальному соответствию с прототипом Ocean2Joy.

---

## 📂 СТРУКТУРА ПАПКИ

```
task_012/
├── README.md                           ← Вы здесь
├── STATUS.md                           ← Статус выполнения задачи
├── CODE_REFERENCE_ServicesOverview.md  ← Референсный код из прототипа
├── DIRECTIVE_INSTRUCTIONS.md           ← 1 директива для Исполнителя (СТРОГО СЛЕДОВАТЬ!)
└── [screenshots/]                      ← Папка для скриншотов (создаёт Исполнитель)
```

---

## 🎯 КРАТКОЕ ОПИСАНИЕ ЗАДАЧИ

Services Overview в O2J2 отличается от прототипа Ocean2Joy по 6 критическим параметрам:

1. ❌ **Комментарий** — `{/* ====== 2. SERVICES OVERVIEW ====== */}` вместо `{/* Services Overview */}`
2. ❌ **Атрибуты** — `id="services"`, `data-testid` присутствуют
3. ❌ **Кнопка "Learn More"** — `bg-sky-600` вместо градиента `from-sky-500 to-teal-500`
4. ❌ **Кнопка "Learn More"** — иконка стрелки вместо простого текста
5. ❌ **animationDelay** — `services.indexOf(service)` вместо `index`
6. ❌ **price_description** — условная проверка вместо безусловного отображения

---

## 📋 ДЛЯ ИСПОЛНИТЕЛЯ

1. **Открой файл** `DIRECTIVE_INSTRUCTIONS.md` — в нём 1 директива с готовым блоком кода для copy-paste.
2. **Используй файл** `CODE_REFERENCE_ServicesOverview.md` — там референсный код из прототипа.
3. **Следуй чеклисту** в конце `DIRECTIVE_INSTRUCTIONS.md` перед отправкой отчёта.
4. **ОБЯЗАТЕЛЬНО приложи минимум 2 скриншота**:
   - `services_desktop_before.png`
   - `services_desktop_after.png`

---

## ⚠️ КРИТИЧЕСКИ ВАЖНО

- **НЕ импровизируй** — используй только код из `CODE_REFERENCE_ServicesOverview.md`.
- **НЕ трогай картинки** (`service.image_url`) — они приходят из API и в O2J2 более удачные.
- **НЕ добавляй** свои "улучшения" — только то, что указано в директиве.
- **НЕ забудь** скриншоты — без них задача считается НЕ выполненной.

---

**Удачи!**