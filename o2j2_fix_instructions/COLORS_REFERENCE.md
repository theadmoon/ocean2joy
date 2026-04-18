# 🎨 ТОЧНЫЕ ЦВЕТА ИЗ ПРОТОТИПА

## ❌ НЕ ИСПОЛЬЗУЙ ЭТИ ЦВЕТА (твой текущий вариант)

```
Background: #050A14 (Abyssal Navy) — ТЁМНЫЙ
Primary: #FF6B6B (Luminous Coral) — КОРАЛЛОВЫЙ
Theme: Dark Cinematic
```

---

## ✅ ИСПОЛЬЗУЙ ЭТИ ЦВЕТА (из прототипа)

### **Основные цвета бренда:**

```css
/* Ocean Blue (главный цвет) */
#0ea5e9
HSL: 199° 89% 48%
RGB: 14, 165, 233
Tailwind: sky-500

/* Ocean Blue Dark (для hover) */
#0369a1
HSL: 199° 89% 35%
RGB: 3, 105, 161
Tailwind: sky-700

/* Teal (для градиентов) */
#14b8a6
HSL: 173° 80% 40%
RGB: 20, 184, 166
Tailwind: teal-500

/* Amber/Yellow (акцентный цвет, кнопки) */
#f59e0b
HSL: 38° 92% 50%
RGB: 245, 158, 11
Tailwind: yellow-400 / amber-500
```

### **Нейтральные цвета:**

```css
/* Фон страницы */
Background: #ffffff (белый)
Tailwind: bg-white

/* Текст основной */
Text: #111827 (почти чёрный)
Tailwind: text-gray-900

/* Текст вторичный */
Text Secondary: #6b7280 (серый)
Tailwind: text-gray-500

/* Footer фон */
Footer BG: #f3f4f6 (светло-серый)
Tailwind: bg-gray-100

/* Borders */
Border: #e5e7eb (светло-серый)
Tailwind: border-gray-200
```

---

## 🎨 КАК ИСПОЛЬЗОВАТЬ В КОДЕ

### **Hero Section (Ocean Gradient):**

```jsx
<section 
  style={{
    backgroundImage: `linear-gradient(rgba(14, 165, 233, 0.85), rgba(20, 184, 166, 0.85)), url('...')`,
    // Ocean blue (#0ea5e9) → Teal (#14b8a6)
  }}
>
```

### **Navbar:**

```jsx
<nav className="bg-white shadow-md">
  <Link to="/services" className="text-gray-700 hover:text-sky-600">
    {/* Текст: #374151 (#gray-700), Hover: #0284c7 (#sky-600) */}
  </Link>
</nav>
```

### **CTA Buttons:**

```jsx
{/* Главная кнопка (жёлтая/amber) */}
<Link to="/request" className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
  Start Your Project
</Link>

{/* Вторичная кнопка (ocean gradient) */}
<Link to="/services" className="bg-gradient-to-r from-sky-500 to-teal-500 text-white hover:from-sky-600 hover:to-teal-600">
  Explore Services
</Link>
```

### **Service Cards:**

```jsx
{/* Premium tier (featured) */}
<div className="border-2 border-sky-500 bg-sky-50 shadow-xl">
  {/* Border: ocean blue, фон: светлый ocean blue */}
  <span className="bg-sky-600 text-white">Popular</span>
</div>

{/* Regular tiers */}
<div className="border border-gray-200 bg-white shadow-md hover:shadow-lg">
  {/* Border: серый, фон: белый */}
</div>
```

### **Footer:**

```jsx
<footer className="bg-gray-100 border-t border-gray-200">
  <p className="text-gray-600">
    Individual Entrepreneur Vera Iambaeva
  </p>
</footer>
```

---

## 📋 CSS ПЕРЕМЕННЫЕ ДЛЯ `index.css`

```css
@layer base {
  :root {
    /* Light theme (НЕ dark!) */
    --background: 0 0% 100%;        /* white */
    --foreground: 0 0% 3.9%;        /* near-black */
    
    --card: 0 0% 100%;              /* white */
    --card-foreground: 0 0% 3.9%;   /* near-black */
    
    --popover: 0 0% 100%;           /* white */
    --popover-foreground: 0 0% 3.9%; /* near-black */
    
    --primary: 0 0% 9%;             /* near-black */
    --primary-foreground: 0 0% 98%; /* white */
    
    --secondary: 0 0% 96.1%;        /* light gray */
    --secondary-foreground: 0 0% 9%; /* near-black */
    
    --muted: 0 0% 96.1%;            /* light gray */
    --muted-foreground: 0 0% 45.1%; /* medium gray */
    
    --accent: 0 0% 96.1%;           /* light gray */
    --accent-foreground: 0 0% 9%;   /* near-black */
    
    --destructive: 0 84.2% 60.2%;   /* red */
    --destructive-foreground: 0 0% 98%; /* white */
    
    --border: 0 0% 89.8%;           /* light gray */
    --input: 0 0% 89.8%;            /* light gray */
    --ring: 0 0% 3.9%;              /* near-black */
    
    --radius: 0.5rem;
  }
}
```

**НЕ ДОБАВЛЯЙ `.dark` theme** — в прототипе его нет!

---

## 🎯 ВИЗУАЛЬНАЯ ПРОВЕРКА

**После исправления цвета должны быть:**

✅ **Navbar:** Белый фон, серый текст, ocean blue при hover  
✅ **Hero:** Ocean blue → teal gradient фон, жёлтая кнопка  
✅ **Service Cards:** Белые карточки, ocean blue акценты  
✅ **Footer:** Светло-серый фон, серый текст  

❌ **НЕ должно быть:** Тёмного фона, кораллового цвета, dark theme

---

**Если сомневаешься в цвете — используй Tailwind классы:**
- `bg-white`, `bg-gray-100`, `bg-sky-500`, `bg-yellow-400`
- `text-gray-700`, `text-sky-600`, `text-gray-900`
- `border-gray-200`, `border-sky-500`

Они точно соответствуют прототипу! 🎨