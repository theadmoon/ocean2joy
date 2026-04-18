# ✅ TASK #003 CHECKLIST — Быстрая проверка

## Перед началом

- [ ] Склонирован репозиторий O2J2: `git clone https://github.com/theadmoon/O2J2`
- [ ] Прочитан файл `/app/o2j2_iterations/task_003/INSTRUCTIONS.md`
- [ ] Прочитан эталон `/app/frontend/src/pages/Homepage.js` (506 строк)

---

## Установка зависимостей

```bash
cd /tmp/O2J2/frontend
yarn add react-icons axios
```

- [ ] Установлен `react-icons`
- [ ] Установлен `axios`
- [ ] `package.json` обновлен

---

## Файл 1: `/frontend/src/App.css`

- [ ] Добавлены океанские классы:
  - [ ] `.text-ocean`
  - [ ] `.ocean-gradient`
  - [ ] `.ocean-gradient-light`
  - [ ] `.card-ocean`
  - [ ] `.animate-wave`
  - [ ] `.animate-float`
  - [ ] `.line-clamp-3`
- [ ] CSS-переменные `:root` добавлены (`--ocean-blue`, `--wave-teal`, и т.д.)

---

## Файл 2: `/frontend/src/pages/Homepage.jsx`

### Импорты

- [ ] `import { FaPlay, FaRocket, FaVideo, FaMagic, FaCheckCircle } from 'react-icons/fa';`
- [ ] `import axios from 'axios';`
- [ ] `import { useEffect, useState } from 'react';`
- [ ] `const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;`
- [ ] `const API = \`\${BACKEND_URL}/api\`;`

### State и API

- [ ] `const [services, setServices] = useState([]);`
- [ ] `const [demoVideos, setDemoVideos] = useState([]);`
- [ ] `const [paymentSettings, setPaymentSettings] = useState(null);`
- [ ] `useEffect(() => { fetchServices(); fetchDemoVideos(); fetchPaymentSettings(); }, []);`
- [ ] Функция `fetchServices()` → `/api/services`
- [ ] Функция `fetchDemoVideos()` → `/api/demo-videos`
- [ ] Функция `fetchPaymentSettings()` → `/api/payment-settings`
- [ ] Функция `renderVideoPlayer(video)` присутствует (с поддержкой Yandex/Google/Direct URL)

### Секции (в порядке сверху вниз)

- [ ] **1. Hero Section**
  - [ ] Градиентный фон: `linear-gradient(rgba(14, 165, 233, 0.85), rgba(20, 184, 166, 0.85))`
  - [ ] Кнопка 1: `<FaRocket /> Start Your Project` → `/request`
  - [ ] Кнопка 2: `<FaPlay /> Explore Services` → `/services`
  - [ ] Анимированные волны (SVG с классом `animate-wave`)

- [ ] **2. Services Overview**
  - [ ] Заголовок: `Our <span className="text-ocean">Video Services</span>`
  - [ ] `{services.map((service) => <div className="card-ocean">...)}`
  - [ ] Карточки с:
    - [ ] Изображением (`service.image_url`)
    - [ ] Названием (`service.title`)
    - [ ] Описанием (`service.description`)
    - [ ] Ценой (`service.base_price`)
    - [ ] Кнопкой `<Link to={/services/${service.id}}>Learn More</Link>`

- [ ] **3. "Why Choose Us"**
  - [ ] Фон: `className="py-20 px-4 ocean-gradient-light"`
  - [ ] Заголовок: `Why Ride the <span className="text-ocean">Ocean2joy Wave?</span>`
  - [ ] 4 карточки (grid `md:grid-cols-2 lg:grid-cols-4`):
    - [ ] Professional Quality (`<FaVideo />`)
    - [ ] Custom Made (`<FaMagic />`)
    - [ ] Digital Delivery (`<FaRocket />`)
    - [ ] Revisions Included (`<FaCheckCircle />`)
  - [ ] Круглые иконки: `className="w-20 h-20 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full"`

- [ ] **4. Demo Videos**
  - [ ] Заголовок: `See Our <span className="text-ocean">Work in Action</span>`
  - [ ] `{demoVideos.length > 0 ? demoVideos.map(...) : /* Fallback на 2 Vimeo */ }`
  - [ ] Vimeo iframe 1: `https://player.vimeo.com/video/115098447`
  - [ ] Vimeo iframe 2: `https://player.vimeo.com/video/342333493`
  - [ ] Теги для каждого видео (`bg-sky-100 text-sky-800`)
  - [ ] Примечание: `* Demo videos are representative examples...`

- [ ] **5. Payments Section**
  - [ ] Фон: `className="py-20 px-4 bg-gray-50"`
  - [ ] Условие: `{paymentSettings ? <div>...</div> : <p>Loading...</p>}`
  - [ ] Карточка 1: Bank Transfer (IBAN, SWIFT, Beneficiary, Intermediary Banks, QR-код)
  - [ ] Карточка 2: PayPal (`paymentSettings.paypal_email`, инструкции)
  - [ ] Информационный блок: "How Payment Works"

- [ ] **6. CTA Section**
  - [ ] Фон: `className="py-20 px-4 ocean-gradient text-white"`
  - [ ] Заголовок: `Ready to Make Waves?`
  - [ ] Кнопка: `<Link to="/request">Get Started Now</Link>`
  - [ ] Доп. ссылка: `Or <Link to="/contact">contact us</Link>`

---

## Тестирование

### Запуск локального сервера

```bash
cd /tmp/O2J2/frontend
yarn start
```

- [ ] Сервер запускается без ошибок
- [ ] Открывается `http://localhost:3000`

### Консоль браузера (F12)

- [ ] Нет ошибок импорта `react-icons`
- [ ] Нет ошибок импорта `axios`
- [ ] Нет ошибок `FaPlay is not defined`

### Network Tab (F12 → Network → Fetch/XHR)

- [ ] Запрос: `GET /api/services`
- [ ] Запрос: `GET /api/demo-videos`
- [ ] Запрос: `GET /api/payment-settings`

### Визуальная проверка (скролл всей страницы)

- [ ] Hero section: океанский градиент, 2 кнопки с иконками
- [ ] Services Overview: заголовок с градиентом, карточки (могут быть пустыми)
- [ ] "Why Choose Us": светлый фон, 4 карточки с круглыми иконками
- [ ] Demo Videos: 2 Vimeo iframe (если БД пустая)
- [ ] Payments: 2 карточки (Bank Transfer + PayPal) или "Loading..."
- [ ] CTA: градиентный фон, желтая кнопка

---

## Финализация

### Git

```bash
git add .
git commit -m "Task #003: Restore Homepage visual identity to 99%"
git push origin main
```

- [ ] Коммит создан
- [ ] Push в `main` branch выполнен

### Отчет

- [ ] Screenshot главной страницы (полный скролл)
- [ ] Git commit hash: `_______________`
- [ ] Измененные файлы:
  - [ ] `/frontend/src/pages/Homepage.jsx`
  - [ ] `/frontend/src/App.css`
  - [ ] `/frontend/package.json`
- [ ] Статус:
  - [ ] ✅ Консоль без ошибок
  - [ ] ✅ API вызовы отправляются
  - [ ] ✅ Визуально идентично прототипу на 99%

---

## Критерий успеха

✅ Homepage содержит **506 строк** (±10 строк допускается)  
✅ Все **6 секций** присутствуют в правильном порядке  
✅ **3 API вызова** отправляются при загрузке  
✅ **Визуально идентично** Ocean2Joy прототипу (светлая океанская тема)

---

**Статус**: ⏳ ОЖИДАЕТ ИСПОЛНЕНИЯ  
**Приоритет**: P0 (КРИТИЧЕСКИЙ)
