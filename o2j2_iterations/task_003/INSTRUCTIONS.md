# 🎯 TASK #003: Полное восстановление Homepage до визуальной идентичности 99%

**Дата создания**: 2025-12-XX  
**Приоритет**: **P0 (КРИТИЧЕСКИЙ)**  
**Архитектор**: Main Agent  
**Исполнитель**: Executor Agent  
**Репозиторий**: `https://github.com/theadmoon/O2J2`

---

## 📋 КОНТЕКСТ

Task #001 и #002 успешно исправили **цветовую схему** (темная → светлая океанская тема).  
Однако **Homepage.jsx имеет только 24% контента** от оригинала (122 строки вместо 506).

**Результат**: Главная страница выглядит **совершенно иначе** ❌

**Цель**: Восстановить **99% визуальную идентичность** с прототипом `/app/frontend/src/pages/Homepage.js`, сохранив светлую океанскую тему.

---

## 🚨 КРИТИЧЕСКИЕ ОТЛИЧИЯ

### 1. ОТСУТСТВУЮЩИЕ СЕКЦИИ (5 из 6)

| # | Секция | Оригинал | O2J2 | Статус |
|---|--------|----------|------|--------|
| 1 | Hero Section | ✅ Есть | ✅ Есть | ⚠️ Нужны иконки + правки |
| 2 | **Services Overview** | ✅ Есть (с API) | ❌ Заменена на Service Tiers | **ТРЕБУЕТСЯ ЗАМЕНА** |
| 3 | **"Why Choose Us"** | ✅ Есть | ❌ Отсутствует | **ТРЕБУЕТСЯ ДОБАВЛЕНИЕ** |
| 4 | **Demo Videos** | ✅ Расширенная версия | ❌ Упрощенная заглушка | **ТРЕБУЕТСЯ ЗАМЕНА** |
| 5 | **Payments Section** | ✅ Есть | ❌ Отсутствует | **ТРЕБУЕТСЯ ДОБАВЛЕНИЕ** |
| 6 | **CTA Section** | ✅ Есть | ❌ Отсутствует | **ТРЕБУЕТСЯ ДОБАВЛЕНИЕ** |

### 2. ОТСУТСТВУЮЩИЕ API ВЫЗОВЫ

```jsx
// ❌ В O2J2 НЕТ:
const [services, setServices] = useState([]);
const [demoVideos, setDemoVideos] = useState([]);
const [paymentSettings, setPaymentSettings] = useState(null);

useEffect(() => {
  fetchServices();         // /api/services
  fetchDemoVideos();       // /api/demo-videos
  fetchPaymentSettings();  // /api/payment-settings
}, []);
```

### 3. ОТСУТСТВУЮЩИЕ ЗАВИСИМОСТИ

```bash
# ❌ В O2J2 НЕТ:
react-icons    # Для FaPlay, FaRocket, FaVideo, FaMagic, FaCheckCircle
axios          # Для API вызовов
```

### 4. ОТСУТСТВУЮЩИЕ СТИЛИ

**Файл**: `/frontend/src/App.css` ИЛИ `/frontend/src/index.css`

```css
/* ❌ В O2J2 НЕТ следующих классов: */
.text-ocean { ... }
.ocean-gradient { ... }
.ocean-gradient-light { ... }
.card-ocean { ... }
.animate-wave { ... }
.animate-float { ... }
.line-clamp-3 { ... }
```

**ВАЖНО**: В оригинальном прототипе эти классы находятся в `/app/frontend/src/App.css` (строки 25-83).  
В O2J2 их **нужно добавить** либо в `App.css`, либо в `index.css`.

---

## 📂 ЭТАЛОННЫЙ КОД (НЕ МОДИФИЦИРОВАТЬ!)

**Путь на вашей машине**: `/app/frontend/src/pages/Homepage.js`  
**Статус**: READ-ONLY (прототип Ocean2Joy)

**Что делать**:
1. Откройте этот файл для справки
2. Скопируйте **ВСЮ СТРУКТУРУ** в `/tmp/O2J2/frontend/src/pages/Homepage.jsx`
3. Убедитесь, что **светлая океанская тема сохранена** (не возвращайте темную!)

---

## ✅ ИНСТРУКЦИИ ДЛЯ ИСПОЛНИТЕЛЯ

### ШАГ 1: Подготовка репозитория

```bash
cd /tmp/O2J2  # Или ваш рабочий каталог O2J2
git pull origin main  # Получите последние изменения
```

---

### ШАГ 2: Установка зависимостей

```bash
cd frontend
yarn add react-icons axios
```

---

### ШАГ 3: Копирование стилей в App.css

**Откройте**: `/tmp/O2J2/frontend/src/App.css`

**СКОПИРУЙТЕ** следующий код в **КОНЕЦ ФАЙЛА** (после строки 48):

```css
/* ============================================
   ОКЕАНСКИЕ КЛАССЫ (Ocean2joy Theme)
   ============================================ */

/* CSS-переменные */
:root {
  --ocean-blue: #0ea5e9;
  --ocean-dark: #0369a1;
  --ocean-light: #7dd3fc;
  --wave-teal: #14b8a6;
  --joy-yellow: #fbbf24;
  --coral: #f97316;
}

/* Градиенты */
.ocean-gradient {
  background: linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%);
}

.ocean-gradient-light {
  background: linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 100%);
}

/* Текст с градиентом */
.text-ocean {
  @apply text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-teal-600;
}

/* Карточка с океанским эффектом */
.card-ocean {
  @apply bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-sky-100;
}

.card-ocean p:not(.text-center) {
  text-align: left !important;
}

/* Анимации */
@keyframes wave {
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(-25%) translateY(-10px);
  }
  100% {
    transform: translateX(-50%) translateY(0);
  }
}

.animate-wave {
  animation: wave 20s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Утилиты */
.line-clamp-3 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
```

**Сохраните файл**.

---

### ШАГ 4: Полная замена Homepage.jsx

**Откройте**: `/tmp/O2J2/frontend/src/pages/Homepage.jsx`

**СКОПИРУЙТЕ ВЕСЬ КОД** из эталона: `/app/frontend/src/pages/Homepage.js`

**КРИТИЧЕСКИЕ ПРАВКИ** (применить ПОСЛЕ копирования):

#### 4.1. Изменить импорты

```jsx
// ❌ УБРАТЬ:
import Footer from '../components/Layout/Footer';
import { useAuth } from '../context/AuthContext';

// ✅ ДОБАВИТЬ (если отсутствуют):
import { FaPlay, FaRocket, FaVideo, FaMagic, FaCheckCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';
```

#### 4.2. Убрать компонент Footer

**Найдите в КОНЦЕ файла**:
```jsx
<Footer />
```

**Удалите эту строку** (если Footer не существует в O2J2).

#### 4.3. Проверить маршруты

**Кнопки в Hero Section должны вести на**:
- Кнопка 1: `/request` (не `/projects/new`!)
- Кнопка 2: `/services` (не `#services`!)

```jsx
<Link to="/request" className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105 inline-flex items-center justify-center">
  <FaRocket className="mr-2" />
  Start Your Project
</Link>
<Link to="/services" className="bg-white/20 backdrop-blur-sm text-white border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/30 transition inline-flex items-center justify-center">
  <FaPlay className="mr-2" />
  Explore Services
</Link>
```

**ЕСЛИ** маршруты `/request` и `/services` не существуют в O2J2, замените их на:
- `/request` → `/projects/new`
- `/services` → `/dashboard` (или оставьте `#services` якорь)

---

### ШАГ 5: Проверка структуры секций

После замены `Homepage.jsx` должен содержать **6 секций** (в порядке):

1. **Hero Section**  
   - Океанский градиент фон
   - 2 кнопки с иконками (`FaRocket`, `FaPlay`)
   - Анимированные волны (SVG)

2. **Services Overview**  
   - `fetchServices()` → `/api/services`
   - `{services.map(...)}` с карточками
   - Класс `card-ocean`

3. **"Why Choose Us"**  
   - `ocean-gradient-light` фон
   - 4 карточки: Professional Quality, Custom Made, Digital Delivery, Revisions Included
   - Иконки: `FaVideo`, `FaMagic`, `FaRocket`, `FaCheckCircle`

4. **Demo Videos**  
   - `fetchDemoVideos()` → `/api/demo-videos`
   - Функция `renderVideoPlayer()` (для Yandex/Google Drive/Direct URLs)
   - Fallback на 2 Vimeo iframe (если БД пустая)

5. **Payments Section**  
   - `fetchPaymentSettings()` → `/api/payment-settings`
   - 2 карточки: Bank Transfer (IBAN/SWIFT) + PayPal
   - QR-код для банка

6. **CTA Section**  
   - `ocean-gradient` фон
   - Кнопка "Get Started Now" → `/request`

---

### ШАГ 6: Тестирование

#### 6.1. Проверка консоли браузера

```bash
cd /tmp/O2J2/frontend
yarn start
```

Откройте `http://localhost:3000`

**Проверьте консоль (F12)**:
- ❌ Нет ошибок импорта `react-icons`
- ❌ Нет ошибок импорта `axios`
- ❌ Нет ошибок `FaPlay is not defined`

#### 6.2. Визуальная проверка

**Откройте главную страницу** и убедитесь:

- ✅ Hero section имеет океанский градиент (голубой-бирюзовый)
- ✅ 2 кнопки с иконками ракеты и плей
- ✅ Секция "Our Video Services" с карточками (может быть пустой, если БД пустая)
- ✅ Секция "Why Choose Us" с 4 карточками и круглыми иконками
- ✅ Секция "Demo Videos" с Vimeo iframe (2 видео)
- ✅ Секция "Payments" с банковскими реквизитами
- ✅ Финальная CTA секция "Ready to Make Waves?"

#### 6.3. Проверка API вызовов

**Откройте DevTools → Network → Fetch/XHR**

При загрузке Homepage должны быть **3 запроса**:
1. `GET /api/services`
2. `GET /api/demo-videos`
3. `GET /api/payment-settings`

**Если Backend не запущен**, это нормально — главное, что вызовы **отправляются**.

---

### ШАГ 7: Коммит и Push

```bash
git add .
git commit -m "Task #003: Restore Homepage visual identity to 99%"
git push origin main
```

---

## ⚠️ КРИТИЧЕСКИЕ ПРАВИЛА

### ❌ НЕ ДЕЛАЙТЕ:

1. **НЕ** заменяйте светлую тему на темную
2. **НЕ** удаляйте секции из оригинала
3. **НЕ** упрощайте структуру "для красоты"
4. **НЕ** заменяйте `react-icons` на `lucide-react` (нужна визуальная идентичность!)
5. **НЕ** модифицируйте файл `/app/frontend/src/pages/Homepage.js` (это прототип!)

### ✅ ОБЯЗАТЕЛЬНО:

1. **Скопируйте ВСЮ структуру** из эталона
2. **Сохраните светлую океанскую тему** (уже корректна в O2J2)
3. **Установите `react-icons` и `axios`**
4. **Добавьте океанские классы** в `App.css`
5. **Убедитесь, что все 6 секций присутствуют**

---

## 📸 РЕФЕРЕНСЫ

### До (O2J2 сейчас)
- 122 строки кода
- 3 секции (Hero, Demo Videos placeholder, Service Tiers)
- Нет API вызовов
- Упрощенный дизайн

### После (O2J2 должен быть)
- 506 строк кода
- 6 секций (полная структура)
- 3 API вызова (`services`, `demo-videos`, `payment-settings`)
- Визуально идентичен Ocean2Joy на 99%

---

## 🎯 КРИТЕРИИ ПРИЕМКИ

### 1. Структура

- [ ] Homepage.jsx содержит **6 секций** (в правильном порядке)
- [ ] Все секции имеют корректные CSS классы (`card-ocean`, `ocean-gradient`, и т.д.)
- [ ] Импортированы `react-icons` и `axios`

### 2. API интеграция

- [ ] `useEffect` вызывает 3 функции: `fetchServices()`, `fetchDemoVideos()`, `fetchPaymentSettings()`
- [ ] Используется `REACT_APP_BACKEND_URL` из `.env`
- [ ] Функция `renderVideoPlayer()` присутствует (для Yandex/Google Drive)

### 3. Визуальная идентичность

- [ ] Hero section: 2 кнопки с иконками (`FaRocket`, `FaPlay`)
- [ ] "Why Choose Us": 4 карточки с круглыми иконками
- [ ] Demo Videos: 2 Vimeo iframe в качестве fallback
- [ ] Payments: Bank Transfer + PayPal карточки
- [ ] CTA: Градиентный фон с желтой кнопкой

### 4. Тестирование

- [ ] `yarn start` запускается без ошибок
- [ ] Консоль браузера не показывает ошибок импорта
- [ ] Network tab показывает 3 API запроса
- [ ] Визуально Homepage выглядит **как прототип** (светлая океанская тема)

---

## 📝 ОТЧЕТ ОБ ИСПОЛНЕНИИ

После завершения Task #003, предоставьте следующую информацию:

1. **Screenshot** главной страницы (полный скролл)
2. **Git commit hash** последнего коммита
3. **Список измененных файлов**:
   - `/frontend/src/pages/Homepage.jsx`
   - `/frontend/src/App.css` (или `index.css`)
   - `/frontend/package.json`
4. **Статус тестирования**:
   - ✅ Консоль без ошибок
   - ✅ API вызовы отправляются
   - ✅ Визуально идентично прототипу

---

**Ожидаемое время выполнения**: 1-2 часа  
**Дедлайн**: Немедленно (P0)

---

**Архитектор**: Main Agent  
**Дата**: 2025-12-XX  
**Статус**: ⏳ ОЖИДАЕТ ИСПОЛНЕНИЯ
