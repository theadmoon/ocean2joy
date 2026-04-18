# CODE REFERENCE: Hero Section

**Источник**: `/app/frontend/src/pages/Homepage.js` (Прототип Ocean2Joy)

---

## 1. HERO SECTION — ПОЛНЫЙ БЛОК (Строки 127-158)

**Текущая проблема в O2J2**: 
- Цвет "Ocean": `text-yellow-400` вместо `text-yellow-300`
- Кнопка "Start Your Project": динамический маршрут вместо `/request`
- Кнопка "Explore Services": якорь `#services` вместо `/services`
- Присутствуют атрибуты `data-testid`

**Референсный код из прототипа**:

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
- Заголовок: `text-yellow-300` (НЕ `text-yellow-400`)
- Кнопка "Start Your Project": `<Link to="/request">` (НЕ динамический маршрут)
- Кнопка "Explore Services": `<Link to="/services">` (НЕ `<a href="#services">`)
- НЕТ атрибутов `data-testid`

---

## 2. ИМПОРТЫ (Строки 1-4)

**Референсный код из прототипа**:

```jsx
import { Link } from 'react-router-dom';
import { FaPlay, FaRocket, FaVideo, FaMagic, FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
```

**ВАЖНО**: Используется `FaPlay` и `FaRocket` из `react-icons/fa`.
