# TASK #010: NAVBAR — 7 КРИТИЧЕСКИХ ИСПРАВЛЕНИЙ

**Статус**: ⏳ В ОЖИДАНИИ ИСПОЛНИТЕЛЯ  
**Приоритет**: 🔴 P0 (Блокирует запуск MVP)  
**Файл**: `frontend/src/components/Layout/Navbar.jsx`  
**Референс**: См. файл `CODE_REFERENCE_Navbar.md` в этой папке  

---

## 🎯 ЦЕЛЬ ЗАДАЧИ

Привести Navbar в O2J2 к 100% визуальному и функциональному соответствию с прототипом Ocean2Joy.

**Текущая проблема**:  
1. ❌ Используется текстовый логотип вместо SVG-файла.  
2. ❌ Публичные ссылки меню используют якорный формат `/#services` вместо `/services`.  
3. ❌ В состоянии "залогинен" используются иконки Lucide (`<LayoutDashboard>`, `<Plus>`, `<LogOut>`), что отличается от прототипа.  
4. ❌ Отсутствуют блоки Quick Switch (для тестирования ролей).  
5. ❌ Кнопка "Start Project" ведёт на `/register` вместо `/request`.  
6. ❌ Мобильное меню использует якорные ссылки вместо прямых маршрутов.  
7. ❌ Используется `react-icons/lucide` вместо `react-icons/hi`.

---

## 📋 7 ДИРЕКТИВ ДЛЯ ИСПРАВЛЕНИЯ

### ✅ ДИРЕКТИВА #1: ЗАМЕНИТЬ ЛОГОТИП НА SVG-ФАЙЛ

**ЧТО ДЕЛАТЬ**:
1. Скопировать файл `/app/frontend/public/logo-horizontal.svg` (из прототипа Ocean2Joy) в папку `O2J2/frontend/public/ocean2joy-logo.svg`.
2. Создать компонент `Logo.jsx` в `frontend/src/components/Layout/Logo.jsx` со следующим содержимым:

```jsx
import React from 'react';

function Logo({ variant = 'vertical', className = '' }) {
  const defaultClass = variant === 'horizontal' ? 'h-24' : 'h-32';
  return (
    <img 
      src="/ocean2joy-logo.svg" 
      alt="Ocean2Joy" 
      className={className || defaultClass}
    />
  );
}

export default Logo;
```

3. В файле `Navbar.jsx`, найти строку:

```jsx
<Logo />
```

4. Заменить на:

```jsx
<Link to="/" className="flex items-center relative -ml-16 -mt-3">
  <Logo variant="horizontal" className="h-36 w-auto" style={{ objectFit: 'contain', display: 'block' }} />
</Link>
```

**РЕФЕРЕНС**: См. `CODE_REFERENCE_Navbar.md`, раздел 1 (строки 28-30 прототипа).

---

### ✅ ДИРЕКТИВА #2: ИСПРАВИТЬ ПУБЛИЧНЫЕ ССЫЛКИ МЕНЮ (ДЕСКТОП)

**ЧТО ДЕЛАТЬ**:
1. В файле `Navbar.jsx`, найти константу `NAV_LINKS` (строки 7-12):

```jsx
const NAV_LINKS = [
  { label: 'Services', href: '/#services' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Our Work', href: '/#demo-videos' },
  { label: 'Contact', href: '/#contact' },
];
```

2. **ПОЛНОСТЬЮ УДАЛИТЬ** эту константу.

3. Найти блок кода (строки 46-57):

```jsx
{/* Public nav links */}
{NAV_LINKS.map((link) => (
  <button
    key={link.label}
    onClick={() => handleNavClick(link.href)}
    className="text-gray-600 hover:text-sky-600 transition"
    data-testid={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
  >
    {link.label}
  </button>
))}
```

4. **ЗАМЕНИТЬ** на:

```jsx
<Link to="/services" className="text-gray-700 hover:text-sky-600 transition">
  Services
</Link>
<Link to="/how-it-works" className="text-gray-700 hover:text-sky-600 transition">
  How It Works
</Link>
<Link to="/contact" className="text-gray-700 hover:text-sky-600 transition">
  Contact
</Link>
```

**ВАЖНО**:  
- Используется `<Link to="/services">`, а НЕ `<button onClick>`.  
- Класс: `text-gray-700` (не `text-gray-600`).  
- НЕТ `data-testid` атрибутов.  

**РЕФЕРЕНС**: См. `CODE_REFERENCE_Navbar.md`, раздел 2 (строки 34-42 прототипа).

---

### ✅ ДИРЕКТИВА #3: УБРАТЬ ИКОНКИ ИЗ СОСТОЯНИЯ "ЗАЛОГИНЕН" (ДЕСКТОП)

**ЧТО ДЕЛАТЬ**:
1. В файле `Navbar.jsx`, найти блок кода (строки 60-72):

```jsx
{user && user.id ? (
  <>
    <Link to="/dashboard" className="text-gray-700 hover:text-sky-600 transition flex items-center gap-1.5" data-testid="nav-dashboard">
      <LayoutDashboard className="w-4 h-4" /> Dashboard
    </Link>
    <Link to="/projects/new" className="text-gray-700 hover:text-sky-600 transition flex items-center gap-1.5" data-testid="nav-new-project">
      <Plus className="w-4 h-4" /> New Project
    </Link>
    <button onClick={handleLogout} className="text-gray-700 hover:text-sky-600 transition flex items-center gap-1.5" data-testid="nav-logout">
      <LogOut className="w-4 h-4" /> Logout
    </button>
    <span className="text-xs text-gray-400 font-normal">{user.name}</span>
  </>
```

2. **ЗАМЕНИТЬ** на:

```jsx
{user && user.id ? (
  <>
    <Link to="/dashboard" className="text-gray-700 hover:text-sky-600 font-medium transition">
      Dashboard
    </Link>
    {user?.role === 'admin' || user?.role === 'manager' ? (
      <Link to="/admin" className="text-gray-700 hover:text-sky-600 font-medium transition">
        Admin
      </Link>
    ) : null}
    
    {/* Quick Switch Buttons (TEMPORARY - for testing) */}
    <div className="flex items-center gap-2 px-4 border-l border-r border-gray-300">
      <span className="text-xs text-gray-500">Quick Switch:</span>
      <button
        onClick={() => handleQuickSwitch('admin')}
        className={`text-xs px-3 py-1 rounded ${
          user?.role === 'admin' 
            ? 'bg-sky-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        title="Switch to Admin"
      >
        👤 Admin
      </button>
      <button
        onClick={() => handleQuickSwitch('client')}
        className={`text-xs px-3 py-1 rounded ${
          user?.email === 'mek110@yahoo.com' 
            ? 'bg-teal-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        title="Switch to Client (Marcos Knight)"
      >
        👥 Client
      </button>
    </div>
    
    <button
      onClick={handleLogout}
      className="text-gray-700 hover:text-sky-600 font-medium transition"
    >
      Logout
    </button>
    <div className="flex items-center space-x-2 pl-4 border-l border-gray-300">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-sky-500 to-teal-500 flex items-center justify-center text-white font-semibold">
        {user?.name?.[0]?.toUpperCase()}
      </div>
      <span className="text-sm text-gray-600">{user?.name}</span>
    </div>
  </>
```

3. Добавить функцию `handleQuickSwitch` в начало компонента (после `handleLogout`):

```jsx
const handleQuickSwitch = async (role) => {
  await quickSwitch(role);
  navigate('/');
  window.location.reload(); // Reload to update all components
};
```

4. Убедиться, что в деструктуризации `useAuth()` присутствует `quickSwitch`:

```jsx
const { user, logout, quickSwitch } = useAuth();
```

**ВАЖНО**:  
- НЕТ иконок (`<LayoutDashboard>`, `<Plus>`, `<LogOut>`) — только текст.  
- НЕТ атрибутов `data-testid`.  
- Добавлена ссылка "Admin" для ролей `admin` и `manager`.  
- Добавлен блок "Quick Switch" с эмодзи 👤 и 👥.  
- Добавлен аватар пользователя с градиентом `from-sky-500 to-teal-500`.  

**РЕФЕРЕНС**: См. `CODE_REFERENCE_Navbar.md`, раздел 3 (строки 44-94 прототипа).

---

### ✅ ДИРЕКТИВА #4: ИСПРАВИТЬ СОСТОЯНИЕ "НЕ ЗАЛОГИНЕН" (ДЕСКТОП)

**ЧТО ДЕЛАТЬ**:
1. В файле `Navbar.jsx`, найти блок кода (строки 74-77):

```jsx
) : (
  <>
    <Link to="/login" className="text-gray-700 hover:text-sky-600 transition" data-testid="nav-login">Login</Link>
    <Link to="/register" className="bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:from-sky-600 hover:to-teal-600 transition shadow-lg" data-testid="nav-register">Start Project</Link>
  </>
)}
```

2. **ЗАМЕНИТЬ** на:

```jsx
) : (
  <>
    <Link to="/login" className="text-gray-700 hover:text-sky-600 font-medium transition">
      Login
    </Link>
    <Link to="/request" className="btn-ocean text-sm">
      Start Project
    </Link>
  </>
)}
```

3. **ПРОВЕРИТЬ**, что в файле `frontend/src/index.css` (или глобальном CSS-файле) присутствует класс `.btn-ocean`:

```css
.btn-ocean {
  @apply bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-lg;
}
.btn-ocean:hover {
  @apply from-sky-600 to-teal-600;
}
```

**Если класс отсутствует** — добавить его в глобальный CSS-файл.

**ВАЖНО**:  
- Кнопка "Start Project" ведёт на `/request`, а НЕ `/register`.  
- Используется класс `btn-ocean`, а НЕ инлайн-классы Tailwind.  
- НЕТ атрибутов `data-testid`.  

**РЕФЕРЕНС**: См. `CODE_REFERENCE_Navbar.md`, раздел 4 (строки 96-103 прототипа).

---

### ✅ ДИРЕКТИВА #5: ИСПРАВИТЬ МОБИЛЬНОЕ МЕНЮ (ПУБЛИЧНЫЕ ССЫЛКИ)

**ЧТО ДЕЛАТЬ**:
1. В файле `Navbar.jsx`, найти блок кода (строки 86-90):

```jsx
{open && (
  <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3 shadow-lg">
    {NAV_LINKS.map((link) => (
      <button key={link.label} onClick={() => handleNavClick(link.href)} className="block text-gray-700 text-sm py-2 hover:text-sky-600 w-full text-left">{link.label}</button>
    ))}
```

2. **ЗАМЕНИТЬ** на:

```jsx
{mobileMenuOpen && (
  <div className="md:hidden pb-4 space-y-2">
    <Link
      to="/services"
      className="block px-4 py-2 text-gray-700 hover:bg-sky-50 rounded"
      onClick={() => setMobileMenuOpen(false)}
    >
      Services
    </Link>
    <Link
      to="/how-it-works"
      className="block px-4 py-2 text-gray-700 hover:bg-sky-50 rounded"
      onClick={() => setMobileMenuOpen(false)}
    >
      How It Works
    </Link>
    <Link
      to="/contact"
      className="block px-4 py-2 text-gray-700 hover:bg-sky-50 rounded"
      onClick={() => setMobileMenuOpen(false)}
    >
      Contact
    </Link>
```

**ВАЖНО**:  
- Переменная `open` переименовывается в `mobileMenuOpen` (для согласованности с прототипом).  
- Используются прямые маршруты (`/services`, `/how-it-works`, `/contact`), а НЕ якорные ссылки.  
- Классы: `block px-4 py-2 text-gray-700 hover:bg-sky-50 rounded`.  

**РЕФЕРЕНС**: См. `CODE_REFERENCE_Navbar.md`, раздел 5 (строки 118-141 прототипа).

---

### ✅ ДИРЕКТИВА #6: ИСПРАВИТЬ МОБИЛЬНОЕ МЕНЮ (СОСТОЯНИЕ "ЗАЛОГИНЕН")

**ЧТО ДЕЛАТЬ**:
1. В файле `Navbar.jsx`, найти блок кода (строки 91-96):

```jsx
{user && user.id ? (
  <>
    <Link to="/dashboard" onClick={() => setOpen(false)} className="block text-gray-700 text-sm py-2 hover:text-sky-600">Dashboard</Link>
    <Link to="/projects/new" onClick={() => setOpen(false)} className="block text-gray-700 text-sm py-2 hover:text-sky-600">New Project</Link>
    <button onClick={() => { handleLogout(); setOpen(false); }} className="block text-gray-700 text-sm py-2 hover:text-sky-600">Logout</button>
  </>
```

2. **ЗАМЕНИТЬ** на:

```jsx
{user && user.id ? (
  <>
    <Link
      to="/dashboard"
      className="block px-4 py-2 text-gray-700 hover:bg-sky-50 rounded"
      onClick={() => setMobileMenuOpen(false)}
    >
      Dashboard
    </Link>
    {user?.role === 'admin' || user?.role === 'manager' ? (
      <Link
        to="/admin"
        className="block px-4 py-2 text-gray-700 hover:bg-sky-50 rounded"
        onClick={() => setMobileMenuOpen(false)}
      >
        Admin
      </Link>
    ) : null}
    
    {/* Quick Switch for Mobile */}
    <div className="px-4 py-2 border-t border-b border-gray-200 my-2">
      <p className="text-xs text-gray-500 mb-2">Quick Switch:</p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            handleQuickSwitch('admin');
            setMobileMenuOpen(false);
          }}
          className={`flex-1 text-xs px-3 py-2 rounded ${
            user?.role === 'admin' 
              ? 'bg-sky-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          👤 Admin
        </button>
        <button
          onClick={() => {
            handleQuickSwitch('client');
            setMobileMenuOpen(false);
          }}
          className={`flex-1 text-xs px-3 py-2 rounded ${
            user?.email === 'mek110@yahoo.com' 
              ? 'bg-teal-600 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          👥 Client
        </button>
      </div>
    </div>
    
    <button
      onClick={() => {
        handleLogout();
        setMobileMenuOpen(false);
      }}
      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-sky-50 rounded"
    >
      Logout
    </button>
  </>
```

**ВАЖНО**:  
- Переменная `setOpen` заменяется на `setMobileMenuOpen`.  
- Добавлена ссылка "Admin" для ролей `admin` и `manager`.  
- Добавлен блок "Quick Switch" с эмодзи.  
- Классы: `block px-4 py-2 text-gray-700 hover:bg-sky-50 rounded`.  

**РЕФЕРЕНС**: См. `CODE_REFERENCE_Navbar.md`, раздел 5 (строки 142-203 прототипа).

---

### ✅ ДИРЕКТИВА #7: ИСПРАВИТЬ ИМПОРТЫ И СОСТОЯНИЕ

**ЧТО ДЕЛАТЬ**:
1. В файле `Navbar.jsx`, найти строки импортов (строки 1-5):

```jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import { Menu, X, LogOut, LayoutDashboard, Plus } from 'lucide-react';
```

2. **ЗАМЕНИТЬ** на:

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import Logo from './Logo';
```

3. Найти строку:

```jsx
const [open, setOpen] = useState(false);
```

4. **ЗАМЕНИТЬ** на:

```jsx
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
```

5. Найти строку (кнопка мобильного меню, строки 81-83):

```jsx
<button className="md:hidden text-gray-700" onClick={() => setOpen(!open)} data-testid="nav-mobile-toggle">
  {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
</button>
```

6. **ЗАМЕНИТЬ** на:

```jsx
<div className="md:hidden">
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="text-gray-700 hover:text-sky-600"
  >
    {mobileMenuOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
  </button>
</div>
```

7. Найти строку (тег контейнера, строка 41):

```jsx
<header className="bg-white shadow-md sticky top-0 z-50" data-testid="navbar">
```

8. **ЗАМЕНИТЬ** на:

```jsx
<nav className="bg-white shadow-md sticky top-0 z-50">
```

9. Найти строку (закрывающий тег, строка 105):

```jsx
</header>
```

10. **ЗАМЕНИТЬ** на:

```jsx
</nav>
```

11. **УДАЛИТЬ** функции `handleNavClick` (строки 25-38) и `useLocation` из импортов, так как они больше не нужны.

**ВАЖНО**:  
- Используется `react-icons/hi` (`HiMenu`, `HiX`), а НЕ `lucide-react`.  
- Переменная `open` переименовывается в `mobileMenuOpen`.  
- Тег `<header>` заменяется на `<nav>`.  
- НЕТ атрибутов `data-testid`.  

**РЕФЕРЕНС**: См. `CODE_REFERENCE_Navbar.md`, разделы 6 и 7 (строки 1-5, 23-26, 107-115 прототипа).

---

## ✅ ЧЕКЛИСТ ДЛЯ ИСПОЛНИТЕЛЯ

Перед отправкой отчёта о выполнении задачи проверь:

- [ ] Логотип отображается как SVG-файл (`ocean2joy-logo.svg`) с высотой `h-36`.
- [ ] Публичные ссылки меню (Services, How It Works, Contact) используют прямые маршруты `/services`, `/how-it-works`, `/contact`.
- [ ] В состоянии "залогинен" НЕТ иконок — только текст (Dashboard, Admin, Logout).
- [ ] Присутствует блок "Quick Switch" с кнопками "👤 Admin" и "👥 Client".
- [ ] Присутствует аватар пользователя с градиентом `from-sky-500 to-teal-500` и первой буквой имени.
- [ ] Кнопка "Start Project" ведёт на `/request` (не `/register`) и использует класс `btn-ocean`.
- [ ] Мобильное меню использует прямые маршруты (не якорные ссылки).
- [ ] Используется `react-icons/hi` (`HiMenu`, `HiX`), а НЕ `lucide-react`.
- [ ] Переменная `open` заменена на `mobileMenuOpen`.
- [ ] Тег `<header>` заменён на `<nav>`.
- [ ] НЕТ атрибутов `data-testid`.
- [ ] Функция `handleNavClick` и константа `NAV_LINKS` удалены.
- [ ] Добавлена функция `handleQuickSwitch` и импортирован метод `quickSwitch` из `useAuth()`.

---

## 📦 ФАЙЛЫ ДЛЯ ОТЧЁТА

После выполнения задачи отправь в папку `task_010`:

1. **SCREENSHOTS** (ОБЯЗАТЕЛЬНО!):
   - `navbar_desktop_logged_out.png` — Navbar в состоянии "не залогинен" (десктоп).
   - `navbar_desktop_logged_in_admin.png` — Navbar в состоянии "залогинен как Admin" (десктоп).
   - `navbar_desktop_logged_in_client.png` — Navbar в состоянии "залогинен как Client" (десктоп).
   - `navbar_mobile_menu_open.png` — Мобильное меню (открыто).

2. **COMPLETION_REPORT.md** — Отчёт о выполнении с отметками о каждой директиве.

---

## 🚨 ANTI-CHECKLIST (НЕ ДЕЛАЙ!)

- ❌ НЕ добавляй свои "улучшения" или "оптимизации".
- ❌ НЕ меняй цвета, отступы или размеры, если это не указано в директивах.
- ❌ НЕ используй `lucide-react` — только `react-icons/hi`.
- ❌ НЕ оставляй атрибуты `data-testid`.
- ❌ НЕ используй якорные ссылки `/#services` — только прямые маршруты `/services`.
- ❌ НЕ забудь приложить скриншоты (4 штуки).

---

**Удачи! Строго следуй директивам.**
