# TASK #012.3: ЗАМЕНИТЬ .card-ocean В App.css

**Статус**: 🔴 КРИТИЧЕСКАЯ ВИЗУАЛЬНАЯ ПРОБЛЕМА  
**Приоритет**: 🔴🔴 P0+  
**Файл**: `frontend/src/App.css`

---

## 🎯 ПРОБЛЕМА

Класс `.card-ocean` в O2J2 использует **обычный CSS**, в прототипе — **Tailwind `@apply`**.  
Это приводит к различиям в тенях, округлении, hover-эффектах.

---

## 📋 ДИРЕКТИВА: ЗАМЕНИТЬ .card-ocean

**ЧТО ДЕЛАТЬ**:

1. Открыть файл `O2J2/frontend/src/App.css`.

2. Найти блок `.card-ocean` (примерно строки 30-45):

```css
.card-ocean {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(14, 165, 233, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  border: 1px solid rgba(14, 165, 233, 0.1);
}

.card-ocean:hover {
  box-shadow: 0 10px 25px rgba(14, 165, 233, 0.2);
  transform: translateY(-4px);
}
```

3. **ПОЛНОСТЬЮ ЗАМЕНИТЬ** на:

```css
.card-ocean {
  @apply bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sky-100;
}
```

**ВАЖНО**:
- Удалить `.card-ocean:hover` — hover-эффекты включены в `hover:shadow-2xl` в `@apply`
- НЕ трогать `.card-ocean p:not(.text-center)` — оставить без изменений

**РЕЗУЛЬТАТ**: Файл должен выглядеть так:

```css
.card-ocean {
  @apply bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sky-100;
}

.text-ocean {
  @apply text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600;
}

/* Animations */
@keyframes wave {
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(-25%) translateY(-10px);
  }
  100% {
    transform: translateX(0) translateY(0);
  }
}

.animate-wave {
  animation: wave 10s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.card-ocean p:not(.text-center),
.project-description,
.info-field {
  text-align: left !important;
}

/* Keep centered only for specific elements */
.page-header,
.section-title,
.cta-section,
.empty-state {
  text-align: center;
}
```

---

## ✅ ЧЕКЛИСТ ДЛЯ ИСПОНИТЕЛЯ

- [ ] Заменён `.card-ocean` на версию с `@apply`
- [ ] Удалён `.card-ocean:hover`
- [ ] Карточки services выглядят как в прототипе (тень, округление, hover)
- [ ] Предоставлен скриншот Services Overview

---

## 📦 ФАЙЛЫ ДЛЯ ОТЧЁТА

1. **SCREENSHOTS** (ОБЯЗАТЕЛЬНО!):
   - `services_card_ocean_fixed.png` — Services Overview с правильным `.card-ocean`

2. **COMPLETION_REPORT.md** — Отчёт о выполнении.

---

**ЭТО ПОСЛЕДНЯЯ КРИТИЧЕСКАЯ ИСПРАВЛЕНИЕ ДЛЯ Services Overview!**