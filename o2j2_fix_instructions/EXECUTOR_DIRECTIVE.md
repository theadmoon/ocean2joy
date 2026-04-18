# 🎯 ДИРЕКТИВА ДЛЯ ИСПОЛНИТЕЛЯ O2J2

## ✅ ЧТО ТЫ СДЕЛАЛ ОТЛИЧНО

**Backend:** 10/10 — идеальная модульная архитектура, все 12 стадий Operational Chain правильные, 11 типов документов, юридическая информация точная, нет хардкода. **НЕ МЕНЯЙ НИЧЕГО В BACKEND!**

**Frontend логика:** Работает правильно, Quick Switch убран (отлично!), Footer содержит правильную юридическую информацию.

---

## ❌ ПРОБЛЕМА: ДИЗАЙН НЕ СООТВЕТСТВУЕТ ПРОТОТИПУ

Ты использовал `design_guidelines.json` (Dark Cinematic Theme), но **задание было скопировать дизайн 1:1 из прототипа** (Light Ocean Theme).

### Что не так:
- ❌ Цвета: `#050A14` (dark) + `#FF6B6B` (coral)
- ✅ Должно быть: `#0ea5e9` (ocean blue) + `#f59e0b` (amber)
- ❌ Тема: Dark theme
- ✅ Должно быть: Light theme (белый фон)

---

## 📋 ТВОЯ ЗАДАЧА

**Переделать ТОЛЬКО frontend дизайн, сохранив backend.**

### Инструкции находятся в репозитории:

```
https://github.com/<user>/o2j2-fix-instructions/
```

(Точную ссылку получишь от пользователя)

### Что читать (в порядке приоритета):

1. **README.md** — обзор
2. **MAIN_INSTRUCTIONS.md** — главные инструкции (START HERE!)
3. **FILES_TO_CHANGE.md** — список файлов с точными изменениями
4. **COLORS_REFERENCE.md** — точные цвета из прототипа

---

## 🔧 ЧТО МЕНЯТЬ (6 изменений)

1. ❌ **Удалить:** `design_guidelines.json`
2. ✏️ **Заменить:** `/frontend/src/index.css` (light theme)
3. ✏️ **Заменить:** `/frontend/src/pages/Homepage.jsx` (ocean gradient, SVG waves, "Dive Into an Ocean...")
4. ✏️ **Заменить:** `/frontend/src/components/Layout/Navbar.jsx` (белый фон, ocean blue hover)
5. ✏️ **Заменить:** `/frontend/src/components/Layout/Footer.jsx` (светлый фон, сохранить юридическую инфо)
6. ➕ **Дополнить:** `/frontend/tailwind.config.js` (добавить ocean colors)

**Backend:** 0 изменений (он идеален!)

---

## ✅ КРИТЕРИЙ УСПЕХА

**После исправления Homepage должна выглядеть так:**

- ✅ Светлый фон (белый/светло-серый)
- ✅ Ocean blue (#0ea5e9) + Amber (#f59e0b) цвета
- ✅ Navbar: белый с тенью
- ✅ Hero: ocean gradient + SVG animated waves + заголовок "Dive Into an **Ocean**..."
- ✅ Кнопка CTA: жёлтая (amber)
- ✅ Footer: светлый, юридическая информация сохранена

---

## 📤 ЧТО ДЕЛАТЬ ПОСЛЕ ИСПРАВЛЕНИЯ

1. Проверь визуально (сравни с прототипом `/app/frontend/src/pages/Homepage.js`)
2. Обнови GitHub:
   - Нажми "Save to GitHub" в UI
   - ИЛИ попроси пользователя это сделать
3. Дай знать пользователю: "✅ Готово! GitHub обновлён"

---

## 💬 ЕСЛИ ВОПРОСЫ

Спроси через пользователя, сославшись на конкретный файл инструкций (например: "В MAIN_INSTRUCTIONS.md непонятно про SVG waves").

---

**Удачи! Backend у тебя отличный — теперь нужно просто привести дизайн в соответствие с прототипом.** 🚀
