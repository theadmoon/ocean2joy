# 📂 СПИСОК ФАЙЛОВ ДЛЯ ИЗМЕНЕНИЯ

## ✅ ФАЙЛЫ, КОТОРЫЕ НУЖНО ИЗМЕНИТЬ (6 файлов)

### **1. Удалить:**

```bash
rm /path/to/o2j2/design_guidelines.json
```

**Причина:** Этот файл содержит неправильные design guidelines (dark theme), которые противоречат заданию.

---

### **2. Заменить полностью:**

#### **`/frontend/src/index.css`**

**Что менять:**
- Убрать dark theme
- Заменить CSS переменные на light theme
- Убрать `.dark` селектор

**Замени на:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

**НЕ ДОБАВЛЯЙ `.dark` theme!**

---

#### **`/frontend/src/pages/Homepage.jsx`**

**Что менять:**
- Hero section: добавить ocean gradient + SVG waves
- Заголовок: "Dive Into an **Ocean** of Video Possibilities"
- Кнопка: `bg-yellow-400` вместо `bg-[#FF6B6B]`
- Demo Videos: светлые карточки, `bg-sky-500` для play кнопки
- Service Tiers: `border-sky-500` для featured, `text-sky-600` для иконок

**Ключевые строки для замены:**

```jsx
// СТРОКА 20: bg class
<div className="min-h-screen bg-white"> {/* БЫЛО: bg-[#050A14] */}

// СТРОКИ 22-47: Hero section
<section 
  className="relative min-h-[600px] flex items-center justify-center overflow-hidden"
  style={{
    backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.85), rgba(20, 184, 166, 0.85)), url('https://images.unsplash.com/photo-1599622465858-a0b63fdc9b80')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
  {/* SVG Animated Waves */}
  <div className="absolute inset-0 opacity-30">
    <svg className="absolute bottom-0 w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
      <path fill="#ffffff" fillOpacity="0.3" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>

  <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
    <h1 className="text-5xl md:text-7xl font-bold mb-6">
      Dive Into an <span className="text-yellow-300">Ocean</span> of Video Possibilities
    </h1>
    <p className="text-xl md:text-2xl mb-8 text-sky-50">
      Professional video production services delivered digitally. From custom filming to AI-powered content.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link to="/projects/new" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition">
        Start Your Project
      </Link>
      <Link to="/services" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition">
        Explore Services
      </Link>
    </div>
  </div>
</section>

// СТРОКИ 50-70: Demo Videos section
<section className="py-20 px-6 bg-gray-50"> {/* БЫЛО: bg-[#0B1325] */}
  {/* ... */}
  <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"> {/* БЫЛО: bg-white/5 border-white/10 */}
    <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center hover:bg-sky-500/40 transition-all"> {/* БЫЛО: bg-[#FF6B6B]/20 */}
      <Play className="w-7 h-7 text-sky-600" /> {/* БЫЛО: text-[#FF6B6B] */}
    </div>
  </div>
</section>

// СТРОКИ 73-105: Service Tiers
<section className="py-20 px-6 bg-white"> {/* БЫЛО: без bg */}
  {/* ... */}
  <div className={
    tier.featured
      ? 'border-2 border-sky-500 bg-sky-50 shadow-xl' // БЫЛО: border-[#FF6B6B]/50 bg-[#FF6B6B]/5
      : 'border border-gray-200 bg-white shadow-md hover:shadow-lg'
  }>
    {tier.featured && (
      <span className="bg-sky-600 text-white ...">Popular</span> // БЫЛО: bg-[#FF6B6B]
    )}
    <tier.icon className={tier.featured ? 'text-sky-600' : 'text-gray-400'} /> // БЫЛО: text-[#FF6B6B]
    <p className="text-sky-600 ...">{ tier.price}</p> // БЫЛО: text-[#FF6B6B]
  </div>
</section>
```

Полный файл: `/tmp/o2j2_fix_instructions/complete_files/Homepage.jsx`

---

#### **`/frontend/src/components/Layout/Navbar.jsx`**

**Что менять:**
- Фон: `bg-white shadow-md` вместо `bg-[#050A14]/70 backdrop-blur-2xl`
- Текст: `text-gray-700` вместо `text-slate-300`
- Hover: `hover:text-sky-600` вместо `hover:text-[#FF6B6B]`
- CTA кнопка: `bg-gradient-to-r from-sky-500 to-teal-500` вместо `bg-[#FF6B6B]`

**Ключевые строки:**

```jsx
// СТРОКА 18: header class
<header className="bg-white shadow-md sticky top-0 z-50"> {/* БЫЛО: backdrop-blur-2xl bg-[#050A14]/70 border-b border-white/10 */}

// СТРОКА 24-29: nav links
<Link to="/dashboard" className="text-gray-700 hover:text-sky-600 transition"> {/* БЫЛО: text-slate-300 hover:text-[#FF6B6B] */}
  Dashboard
</Link>

// СТРОКА 38: CTA button
<Link to="/register" className="bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-teal-600 transition">
  {/* БЫЛО: bg-[#FF6B6B] hover:bg-[#ff5252] */}
  Get Started
</Link>
```

Полный файл: `/tmp/o2j2_fix_instructions/complete_files/Navbar.jsx`

---

#### **`/frontend/src/components/Layout/Footer.jsx`**

**Что менять:**
- Фон: `bg-gray-100` вместо `bg-[#050A14]`
- Border: `border-gray-200` вместо `border-white/10`
- Текст: `text-gray-600` вместо `text-slate-400`
- Иконки: `text-sky-600` вместо `text-[#FF6B6B]`

**Ключевые строки:**

```jsx
// СТРОКА 7: footer class
<footer className="bg-gray-100 border-t border-gray-200 py-12 px-6"> {/* БЫЛО: bg-[#050A14] border-white/10 */}

// СТРОКА 11: текст
<p className="text-gray-600 ..."> {/* БЫЛО: text-slate-400 */}

// СТРОКА 18-20: иконки
<Mail className="w-4 h-4 text-sky-600" /> {/* БЫЛО: text-[#FF6B6B] */}
<Phone className="w-4 h-4 text-sky-600" />
<MapPin className="w-4 h-4 text-sky-600" />

// СТРОКИ 26-28: юридическая информация (НЕ МЕНЯЙ!)
<p>Individual Entrepreneur Vera Iambaeva</p> {/* ✅ ОСТАВЬ КАК ЕСТЬ */}
<p>Tax ID: 302335809</p> {/* ✅ ОСТАВЬ КАК ЕСТЬ */}
<p>Country of Registration: Georgia</p> {/* ✅ ОСТАВЬ КАК ЕСТЬ */}
```

Полный файл: `/tmp/o2j2_fix_instructions/complete_files/Footer.jsx`

---

#### **`/frontend/tailwind.config.js`**

**Что добавить:**

```javascript
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      // Существующие colors (не трогай)
      borderRadius: { /* ... */ },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // ... все остальные shadcn colors ...
        
        // ДОБАВЬ ЭТИ СТРОКИ:
        ocean: '#0ea5e9',        // Ocean blue (главный цвет)
        'ocean-dark': '#0369a1', // Тёмный ocean blue для hover
        teal: '#14b8a6',         // Teal для градиентов
      },
      // Существующие keyframes, animation (не трогай)
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

---

## ❌ ФАЙЛЫ, КОТОРЫЕ НЕ НУЖНО ТРОГАТЬ

### **Backend (ВСЕ файлы в `/backend/`):**

- ✅ `/backend/server.py` — **ИДЕАЛЕН, НЕ ТРОГАЙ!**
- ✅ `/backend/utils/constants.py` — **ПРАВИЛЬНЫЙ, НЕ ТРОГАЙ!**
- ✅ `/backend/routes/` — **НЕ ТРОГАЙ!**
- ✅ `/backend/services/` — **НЕ ТРОГАЙ!**
- ✅ `/backend/models/` — **НЕ ТРОГАЙ!**
- ✅ `/backend/database/` — **НЕ ТРОГАЙ!**

### **Frontend (остальные файлы):**

- ✅ `/frontend/src/components/OperationalChain/` — НЕ ТРОГАЙ (работает правильно)
- ✅ `/frontend/src/components/Chat/` — НЕ ТРОГАЙ
- ✅ `/frontend/src/pages/Login.jsx` — НЕ ТРОГАЙ (можешь только цвета кнопок поправить, если там coral)
- ✅ `/frontend/src/pages/Register.jsx` — НЕ ТРОГАЙ
- ✅ `/frontend/src/pages/ClientDashboard.jsx` — НЕ ТРОГАЙ
- ✅ `/frontend/src/pages/ProjectDetails.jsx` — НЕ ТРОГАЙ
- ✅ `/frontend/src/context/AuthContext.js` — НЕ ТРОГАЙ

---

## 🎯 ИТОГО: 6 ИЗМЕНЕНИЙ

1. ❌ **Удалить:** `design_guidelines.json`
2. ✏️ **Заменить:** `/frontend/src/index.css`
3. ✏️ **Заменить:** `/frontend/src/pages/Homepage.jsx`
4. ✏️ **Заменить:** `/frontend/src/components/Layout/Navbar.jsx`
5. ✏️ **Заменить:** `/frontend/src/components/Layout/Footer.jsx`
6. ➕ **Дополнить:** `/frontend/tailwind.config.js` (добавить ocean colors)

**Backend:** 0 изменений (он идеален!)

**Время работы:** 1.5-2 часа

---

**После исправления обнови GitHub и дай знать!** 🚀