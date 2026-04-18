# ⚠️ ANTI-CHECKLIST: ЧТО НЕ ДЕЛАТЬ

## ❌ ЗАПРЕЩЕНО ТРОГАТЬ

### **Backend (ВСЁ!)**

```
/backend/
├── server.py          ❌ НЕ ТРОГАЙ!
├── config.py          ❌ НЕ ТРОГАЙ!
├── models/            ❌ НЕ ТРОГАЙ!
├── routes/            ❌ НЕ ТРОГАЙ!
├── services/          ❌ НЕ ТРОГАЙ!
├── generators/        ❌ НЕ ТРОГАЙ!
├── utils/             ❌ НЕ ТРОГАЙ!
├── database/          ❌ НЕ ТРОГАЙ!
└── requirements.txt   ❌ НЕ ТРОГАЙ!
```

**Почему:** Backend идеален (10/10), любое изменение может сломать Operational Chain.

---

### **Frontend логика**

```
/frontend/src/
├── components/OperationalChain/   ❌ НЕ ТРОГАЙ (работает правильно)
├── components/Chat/               ❌ НЕ ТРОГАЙ
├── pages/Login.jsx                ❌ НЕ ТРОГАЙ (можно только цвета кнопок)
├── pages/Register.jsx             ❌ НЕ ТРОГАЙ
├── pages/ClientDashboard.jsx      ❌ НЕ ТРОГАЙ
├── pages/ProjectDetails.jsx       ❌ НЕ ТРОГАЙ
├── context/AuthContext.js         ❌ НЕ ТРОГАЙ
├── hooks/                         ❌ НЕ ТРОГАЙ
└── utils/                         ❌ НЕ ТРОГАЙ
```

---

## ❌ ЗАПРЕЩЁННЫЕ ДЕЙСТВИЯ

### **1. НЕ изменяй юридическую информацию**

```jsx
{/* ✅ ОСТАВЬ КАК ЕСТЬ */}
<p>Individual Entrepreneur Vera Iambaeva</p>
<p>Tax ID: 302335809</p>
<p>Country of Registration: Georgia</p>
```

**Эти данные ТОЧНЫЕ и НЕИЗМЕННЫЕ!**

---

### **2. НЕ добавляй новые зависимости**

❌ `yarn add framer-motion`  
❌ `yarn add @emotion/react`  
❌ `pip install новая_библиотека`  

**Используй только существующие зависимости из `package.json` и `requirements.txt`!**

---

### **3. НЕ меняй структуру папок**

❌ Создавать новые папки `/frontend/src/styles/`  
❌ Переименовывать `/components/Layout/` → `/components/layout/`  
❌ Перемещать файлы между папками  

**Файловая структура уже правильная!**

---

### **4. НЕ удаляй существующие компоненты**

❌ `rm /frontend/src/components/OperationalChain/ChainTimeline.jsx`  
❌ Удалять shadcn/ui компоненты из `/components/ui/`  
❌ Удалять хуки из `/hooks/`  

**Если компонент не используется в Homepage — это не значит, что он не нужен!**

---

### **5. НЕ добавляй новые страницы**

❌ Создавать `/pages/About.jsx`  
❌ Создавать `/pages/Pricing.jsx`  

**Задача: исправить дизайн существующих страниц, а не добавлять новые!**

---

### **6. НЕ меняй API endpoints**

❌ Менять `/api/auth/login` → `/api/login`  
❌ Добавлять новые endpoints  
❌ Менять request/response структуру  

**Backend API работает — не трогай!**

---

### **7. НЕ создавай новые файлы конфигурации**

❌ `touch .prettierrc`  
❌ `touch .eslintrc.js`  
❌ `touch next.config.js`  

**Используй существующие конфиги!**

---

### **8. НЕ меняй naming conventions**

❌ `Homepage.jsx` → `home-page.jsx` (kebab-case)  
❌ `ChainTimeline.jsx` → `chain_timeline.jsx` (snake_case)  
❌ `useAuth` → `use-auth`  

**Следуй существующим naming conventions (PascalCase для компонентов, camelCase для функций)!**

---

### **9. НЕ добавляй лишние комментарии**

❌ `// TODO: refactor this later`  
❌ `// FIXME: this is a hack`  
❌ `/* This component handles... (50 lines explanation) */`  

**Код должен быть чистым и самодокументируемым!**

---

### **10. НЕ копируй код из design_guidelines.json**

❌ Использовать `#050A14`, `#FF6B6B`, `Cormorant Garamond`  
❌ Применять dark theme стили  
❌ Использовать "Cinematic, luxury" подход  

**Этот файл — ИСТОЧНИК ОШИБКИ! Удали его и забудь!**

---

## ✅ ЧТО МОЖНО ДЕЛАТЬ

✅ Менять **только 5 файлов** (index.css, Homepage.jsx, Navbar.jsx, Footer.jsx, tailwind.config.js)  
✅ Копировать код из прототипа (`/app/frontend/src/` в ocean2joy GitHub)  
✅ Использовать Tailwind классы из прототипа  
✅ Задавать вопросы через `questions.md` в `/response_001/`  

---

**Помни: Задача — НЕ УЛУЧШИТЬ проект, а ИСПРАВИТЬ ДИЗАЙН на правильный (из прототипа)!** 🎯