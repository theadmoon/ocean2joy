# TASK #011: HERO SECTION — 2 КРИТИЧЕСКИХ ИСПРАВЛЕНИЯ

**Статус**: ⏳ В ОЖИДАНИИ ИСПОЛНИТЕЛЯ  
**Приоритет**: 🔴 P0 (Блокирует визуальное соответствие MVP)  
**Файлы**: 
- `frontend/src/pages/Homepage.jsx`
- `frontend/src/index.css`

**Референс**: См. файлы `CODE_REFERENCE_HeroSection.md` и `CODE_REFERENCE_FontStyles.md` в этой папке  

---

## 🎯 ЦЕЛЬ ЗАДАЧИ

Привести Hero Section и типографику O2J2 к 100% визуальному и функциональному соответствию с прототипом Ocean2Joy.

**Текущая проблема**:  
1. ❌ Отсутствует определение `font-family` для `body` → текст выглядит **тоньше**.  
2. ❌ Слово "Ocean" использует `text-yellow-400` вместо `text-yellow-300` → **менее яркий контраст**.  
3. ❌ Кнопка "Start Your Project" ведёт на динамический маршрут вместо `/request`.  
4. ❌ Кнопка "Explore Services" использует якорь `#services` вместо `/services`.  
5. ❌ Присутствуют атрибуты `data-testid` (их нет в прототипе).  

---

## 📋 2 ДИРЕКТИВЫ ДЛЯ ИСПРАВЛЕНИЯ

### ✅ ДИРЕКТИВА #1: ДОБАВИТЬ ОПРЕДЕЛЕНИЕ ШРИФТА В index.css

**ЧТО ДЕЛАТЬ**:

1. Открыть файл `O2J2/frontend/src/index.css`.

2. Найти строки 1-3:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. **ВСТАВИТЬ ПОСЛЕ СТРОКИ 3** (перед `@layer base {`) следующий блок:

```css

body {
    margin: 0;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

code {
    font-family:
        source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
}
```

**РЕЗУЛЬТАТ**: Файл должен выглядеть так:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
    margin: 0;
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

code {
    font-family:
        source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    ...
```

**ВАЖНО**: НЕ трогать существующий блок `@layer base { body { @apply bg-background text-foreground; } }` (строки 48-55). Он остаётся без изменений.

**РЕФЕРЕНС**: См. `CODE_REFERENCE_FontStyles.md`.

---

### ✅ ДИРЕКТИВА #2: ЗАМЕНИТЬ HERO SECTION В Homepage.jsx

**ЧТО ДЕЛАТЬ**:

1. Открыть файл `O2J2/frontend/src/pages/Homepage.jsx`.

2. Найти блок Hero Section (примерно строки 78-116):

```jsx
{/* ====== 1. HERO SECTION ====== */}
<section 
  className="relative min-h-screen flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.85), rgba(20, 184, 166, 0.85)), url('https://images.unsplash.com/photo-1599622465858-a0b63fdc9b80?auto=format&fit=crop&w=1920&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
  data-testid="hero-section"
>
  <div className="absolute inset-0 opacity-30">
    <svg className="absolute bottom-0 w-full animate-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="#ffffff" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
    </svg>
  </div>
  <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float" data-testid="hero-title">
      Dive Into an <span className="text-yellow-400">Ocean</span> of Video Possibilities
    </h1>
    <p className="text-xl md:text-2xl mb-8 text-sky-50">
      Professional video production services delivered digitally. From custom filming to AI-powered content.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        to={user && user.id ? "/projects/new" : "/register"}
        className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105 inline-flex items-center justify-center"
        data-testid="hero-cta-button"
      >
        <FaRocket className="mr-2" /> Start Your Project
      </Link>
      <a
        href="#services"
        className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition inline-flex items-center justify-center"
        data-testid="hero-explore-button"
      >
        <FaPlay className="mr-2" /> Explore Services
      </a>
    </div>
  </div>
</section>
```

3. **ПОЛНОСТЬЮ ЗАМЕНИТЬ** этот блок на:

```jsx
{/* Hero Section */}
<section 
  className="relative min-h-screen flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.85), rgba(20, 184, 166, 0.85)), url('https://images.unsplash.com/photo-1599622465858-a0b63fdc9b80?auto=format&fit=crop&w=1920&q=80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
  {/* Animated waves overlay */}
  <div className="absolute inset-0 opacity-30">
    <svg className="absolute bottom-0 w-full animate-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="#ffffff" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>

  <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
    <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-float">
      Dive Into an <span className="text-yellow-300">Ocean</span> of Video Possibilities
    </h1>
    <p className="text-xl md:text-2xl mb-8 text-sky-50">
      Professional video production services delivered digitally. From custom filming to AI-powered content.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/request" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105 inline-flex items-center justify-center">
        <FaRocket className="mr-2" />
        Start Your Project
      </Link>
      <Link to="/services" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition inline-flex items-center justify-center">
        <FaPlay className="mr-2" />
        Explore Services
      </Link>
    </div>
  </div>
</section>
```

**ВАЖНО**:
- `text-yellow-300` (НЕ `text-yellow-400`)
- `<Link to="/request">` (НЕ динамический маршрут)
- `<Link to="/services">` (НЕ `<a href="#services">`)
- НЕТ `data-testid`
- Комментарий `{/* Hero Section */}` (НЕ `{/* ====== 1. HERO SECTION ====== */}`)

**РЕФЕРЕНС**: См. `CODE_REFERENCE_HeroSection.md`.

---

## ✅ ЧЕКЛИСТ ДЛЯ ИСПОЛНИТЕЛЯ

Перед отправкой отчёта проверь:

- [ ] В `index.css` добавлен блок `body { font-family: ... }` после строки 3
- [ ] В `index.css` добавлен блок `code { font-family: ... }`
- [ ] В `Homepage.jsx` слово "Ocean" использует `text-yellow-300`
- [ ] Кнопка "Start Your Project" ведёт на `/request`
- [ ] Кнопка "Explore Services" использует `<Link to="/services">`
- [ ] НЕТ атрибутов `data-testid` в Hero Section
- [ ] Комментарий `{/* Hero Section */}` (короткий формат)

---

## 📦 ФАЙЛЫ ДЛЯ ОТЧЁТА

После выполнения задачи отправь в папку `task_011`:

1. **SCREENSHOTS** (ОБЯЗАТЕЛЬНО!):
   - `hero_desktop_before.png` — Hero Section ПЕРЕД изменениями
   - `hero_desktop_after.png` — Hero Section ПОСЛЕ изменений
   - `typography_comparison.png` — Сравнение шрифта (до/после, можно коллаж)

2. **COMPLETION_REPORT.md** — Отчёт о выполнении с отметками о каждой директиве.

---

## 🚨 ANTI-CHECKLIST (НЕ ДЕЛАЙ!)

- ❌ НЕ меняй цвета, отступы или размеры, кроме указанных в директивах
- ❌ НЕ добавляй свои "улучшения" или "оптимизации"
- ❌ НЕ удаляй существующий блок `@layer base { body { @apply ... } }` в `index.css`
- ❌ НЕ оставляй атрибуты `data-testid`
- ❌ НЕ используй динамический маршрут для "Start Your Project"
- ❌ НЕ забудь приложить скриншоты (минимум 2 штуки)

---

**Удачи! Строго следуй директивам.**
