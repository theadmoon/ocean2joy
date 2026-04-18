# 🎯 TASK #005: Финальная визуальная калибровка до 95%+

**Приоритет**: **P0 (КРИТИЧЕСКИЙ)**  
**Дата**: 2025-12-XX  
**Архитектор**: Main Agent  
**Исполнитель**: Executor Agent  

---

## 📋 КОНТЕКСТ

Task #004 достиг **~60% визуальной идентичности** (было ~20%).

**Прогресс**: +40% 🎉

**Оставшиеся проблемы**:
- Demo Videos: неверные теги для Vimeo fallback
- Возможны мелкие отступы (mb-12 вместо mb-16)
- Backend API структура может не совпадать с Frontend ожиданиями

**Цель**: Довести до **95%+ визуальной идентичности** с `/app/frontend/src/pages/Homepage.js`

---

## ⚠️ КРИТИЧЕСКИЕ ТРЕБОВАНИЯ

### 1. **СКРИНШОТЫ — ОБЯЗАТЕЛЬНО**

После **КАЖДОГО** изменения делать скриншоты:
- Полная главная страница (full page screenshot)
- Отдельные скриншоты секций (Hero, Services, Why Choose Us, Demo Videos, Payments, CTA)

**Формат**:
```bash
# После каждой правки
yarn start  # запустить dev сервер
# Открыть http://localhost:3000
# Сделать скриншоты (можно через browser DevTools или screenshot tool)
# Сохранить в `/tmp/O2J2/screenshots/task_005/`
```

**Включить в отчет**:
- `/tmp/O2J2/screenshots/task_005/full_page.png`
- `/tmp/O2J2/screenshots/task_005/services_section.png`
- `/tmp/O2J2/screenshots/task_005/payments_section.png`
- И т.д.

---

### 2. **НЕ ЗАПРАШИВАТЬ ВИДЕО У ПОЛЬЗОВАТЕЛЯ**

❌ **НЕ ПИСАТЬ**:
- "Пожалуйста, предоставьте демо-видео"
- "Ожидаю ссылки на Vimeo"
- "Нужны реальные MP4 файлы"

✅ **ВМЕСТО ЭТОГО**:
- Использовать **hardcoded** Vimeo URL из оригинала:
  - `https://player.vimeo.com/video/115098447` (или замена на 824804225, если 115098447 не работает)
  - `https://player.vimeo.com/video/342333493`
- Пользователь **сам решит**, когда передавать реальные видео
- Фокус на **форматировании и содержательной части**, не на контенте

---

## 🔧 ЗАДАЧИ

### 🎯 ЗАДАЧА 1: Demo Videos — Hardcoded теги для Vimeo (P0)

**Файл**: `/tmp/O2J2/frontend/src/pages/Homepage.jsx`

**Проблема**: Теги "Demo", "Sample" вместо "Drama", "Professional", "HD Quality"

**НАЙТИ** fallback секцию (когда `demoVideos.length === 0` или пустой массив):
```jsx
) : (
  <>
    {/* Первое Vimeo видео */}
    <div className="card-ocean">
      <div className="aspect-video bg-gray-900 relative overflow-hidden">
        <iframe src="https://player.vimeo.com/video/824804225?..." />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Custom Video</h3>
        <p className="text-gray-600">Example of our custom video production with professional actors and crew</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">Demo</span>
          <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Sample</span>
        </div>
      </div>
    </div>
  </>
)}
```

**ЗАМЕНИТЬ теги на**:
```jsx
        <div className="mt-3 flex items-center gap-2">
          <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">Drama</span>
          <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Professional</span>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">HD Quality</span>
        </div>
```

**Для второго Vimeo видео**:
```jsx
        <div className="mt-3 flex items-center gap-2">
          <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">AI Tech</span>
          <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Innovative</span>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Digital</span>
        </div>
```

**Метод**: `search_replace`

---

### 🎯 ЗАДАЧА 2: Проверка вертикальных отступов (P1)

**Файл**: `/tmp/O2J2/frontend/src/pages/Homepage.jsx`

**Проверить** каждую секцию:

#### Services Section
**НАЙТИ**:
```jsx
      <section className="py-20 px-4" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">  {/* ❓ mb-12 или mb-16? */}
```

**ДОЛЖНО БЫТЬ**:
```jsx
          <div className="text-center mb-16">  {/* ✅ mb-16 */}
```

---

#### Why Choose Us Section
**НАЙТИ**:
```jsx
      <section className="py-20 px-4 ocean-gradient-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">  {/* ❓ mb-12 или mb-16? */}
```

**ДОЛЖНО БЫТЬ**:
```jsx
          <div className="text-center mb-16">  {/* ✅ mb-16 */}
```

---

#### Demo Videos Section
**НАЙТИ**:
```jsx
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">  {/* ❓ mb-12 или mb-16? */}
```

**ДОЛЖНО БЫТЬ**:
```jsx
          <div className="text-center mb-16">  {/* ✅ mb-16 */}
```

---

### 🎯 ЗАДАЧА 3: Payments Section — Проверка структуры (P2)

**Файл**: `/tmp/O2J2/frontend/src/pages/Homepage.jsx`

**Проверить**, какая структура используется:

**Оригинал ожидает**:
```jsx
{paymentSettings.bank_transfer.beneficiary_bank_name}
{paymentSettings.bank_transfer.intermediary_bank_1.name}
```

**Текущая backend структура** (судя по скриншоту):
```jsx
{paymentSettings.bank_name}
{paymentSettings.intermediary_bank}
```

**Действие**:
1. Посмотреть код Payments Section (строки ~260-350)
2. Если используется **упрощенная структура** (`paymentSettings.bank_name`):
   - ✅ **Оставить как есть** (Frontend уже адаптирован к backend)
   - Пометить в отчете: "Payments структура упрощена, но визуально корректна"

3. Если используется **вложенная структура** (`paymentSettings.bank_transfer.*`):
   - Проверить, что backend API `/api/payment-settings` возвращает такую структуру
   - Если нет — адаптировать Frontend к текущей backend структуре

**Цель**: Убедиться, что Payments Section **отображается корректно** (без ошибок в консоли)

---

### 🎯 ЗАДАЧА 4: Финальные скриншоты (P0)

**После всех правок**:

1. Запустить dev сервер:
   ```bash
   cd /tmp/O2J2/frontend
   yarn start
   ```

2. Открыть `http://localhost:3000`

3. Сделать **7 скриншотов**:
   - `full_page.png` (полная страница, скролл сверху вниз)
   - `hero_section.png`
   - `services_section.png`
   - `why_choose_section.png`
   - `demo_videos_section.png`
   - `payments_section.png`
   - `cta_section.png`

4. Сохранить в:
   ```
   /tmp/O2J2/screenshots/task_005/
   ```

5. Включить в Git commit (добавить в репозиторий)

---

## ✅ КРИТЕРИИ ПРИЕМКИ

### 1. Код

- [ ] Demo Videos: теги "Drama", "Professional", "HD Quality" для Vimeo 1
- [ ] Demo Videos: теги "AI Tech", "Innovative", "Digital" для Vimeo 2
- [ ] Все секции: `mb-16` (не `mb-12`) для заголовков
- [ ] Payments: отображается без ошибок в консоли

### 2. Скриншоты

- [ ] 7 скриншотов сохранены в `/tmp/O2J2/screenshots/task_005/`
- [ ] Скриншоты включены в Git commit
- [ ] Скриншоты показывают **визуально идентичную** Homepage оригиналу

### 3. Тестирование

- [ ] `yarn start` запускается без ошибок
- [ ] Консоль браузера без ошибок (F12)
- [ ] Network tab: 3 API запроса (`/api/services`, `/api/demo-videos`, `/api/payment-settings`)
- [ ] Все 6 секций отображаются корректно

---

## 📝 ОТЧЕТ ОБ ИСПОЛНЕНИИ

После завершения Task #005, предоставьте:

### 1. Git Commit
```bash
git add .
git commit -m "Task #005: Final visual calibration - 95%+ identity"
git push origin main
```

### 2. Структура отчета

```
/tmp/O2J2/o2j2_iterations/response_005/
├── status.md
├── changes_summary.md
└── screenshots/
    ├── full_page.png
    ├── hero_section.png
    ├── services_section.png
    ├── why_choose_section.png
    ├── demo_videos_section.png
    ├── payments_section.png
    └── cta_section.png
```

**`status.md`**:
```markdown
# Task #005 Complete

## Summary
- Demo Videos tags updated to match prototype
- Vertical spacings corrected (mb-16)
- Payments section verified
- 7 screenshots captured

## Changes
1. Homepage.jsx: Updated Vimeo fallback tags (lines XXX-YYY)
2. Homepage.jsx: Corrected mb-12 → mb-16 (lines ZZZ)

## Screenshots
All 7 screenshots available in /tmp/O2J2/screenshots/task_005/

## Visual Identity: 95%+
```

**`changes_summary.md`**:
```markdown
# Detailed Changes

## File: /frontend/src/pages/Homepage.jsx

### Change 1: Demo Videos - Vimeo tags
**Line**: ~215
**Before**: `<span>Demo</span><span>Sample</span>`
**After**: `<span>Drama</span><span>Professional</span><span>HD Quality</span>`

### Change 2: Services Section - mb-16
**Line**: ~120
**Before**: `<div className="text-center mb-12">`
**After**: `<div className="text-center mb-16">`

...
```

---

## 🚫 ЧТО **НЕ ДЕЛАТЬ**

1. ❌ **НЕ запрашивать видео** у пользователя
2. ❌ **НЕ модифицировать backend** без согласования (если Payments работает — оставить)
3. ❌ **НЕ упрощать** структуру ради "чистоты кода"
4. ❌ **НЕ пропускать скриншоты** (это обязательное требование!)

---

## ✅ ЧТО ДЕЛАТЬ

1. ✅ **Фокус на форматировании** и содержательной части
2. ✅ **Делать скриншоты** после каждого изменения
3. ✅ **Сравнивать визуально** с оригиналом `/app/frontend/src/pages/Homepage.js`
4. ✅ **Использовать hardcoded данные** (Vimeo URL, теги)
5. ✅ **Минимальные правки** — только то, что влияет на визуальное восприятие

---

## 🎯 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ

**Визуальная идентичность**: **95%+**

**Пользователь должен увидеть**:
- Homepage **идентична** оригиналу Ocean2Joy
- Все секции на своих местах
- Правильные размеры, отступы, цвета
- Корректные теги в Demo Videos
- Payments Section работает без ошибок

---

**Время выполнения**: 1-2 часа  
**Дедлайн**: Немедленно (P0)

---

**Архитектор**: Main Agent  
**Статус**: ⏳ ОЖИДАЕТ ИСПОЛНЕНИЯ
