# TASK #012: SERVICES OVERVIEW — ИСПРАВЛЕНИЕ СТИЛЕЙ И АТРИБУТОВ

**Статус**: ⏳ В ОЖИДАНИИ ИСПОЛНИТЕЛЯ  
**Приоритет**: 🔴 P0 (Блокирует визуальное соответствие MVP)  
**Файл**: `frontend/src/pages/Homepage.jsx`

**Референс**: См. файл `CODE_REFERENCE_ServicesOverview.md` в этой папке  

---

## 🎯 ЦЕЛЬ ЗАДАЧИ

Привести Services Overview в O2J2 к 100% визуальному и функциональному соответствию с прототипом Ocean2Joy.

**Текущая проблема**:  
1. ❌ Комментарий `{/* ====== 2. SERVICES OVERVIEW ====== */}` вместо `{/* Services Overview */}`  
2. ❌ Присутствуют атрибуты `id="services"`, `data-testid="services-section"`, `data-testid="service-card-${service.id}"`  
3. ❌ Кнопка "Learn More": градиент `bg-sky-600` вместо `bg-gradient-to-r from-sky-500 to-teal-500`  
4. ❌ Кнопка "Learn More": иконка стрелки вместо простого текста  
5. ❌ animationDelay: `services.indexOf(service)` вместо `index`  
6. ❌ Условная проверка `{service.price_description && ...}` вместо безусловного отображения  

---

## 📋 ЕДИНСТВЕННАЯ ДИРЕКТИВА

### ✅ ДИРЕКТИВА #1: ЗАМЕНИТЬ SERVICES OVERVIEW БЛОК В Homepage.jsx

**ЧТО ДЕЛАТЬ**:

1. Открыть файл `O2J2/frontend/src/pages/Homepage.jsx`.

2. Найти блок Services Overview (примерно строки 113-170):

```jsx
{/* ====== 2. SERVICES OVERVIEW ====== */}
<section className="py-20 px-4" id="services" data-testid="services-section">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Our <span className="text-ocean">Video Services</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Three waves of creativity to bring your vision to life
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {services.map((service) => (
        <div
          key={service.id}
          className="card-ocean group hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: `${services.indexOf(service) * 100}ms` }}
          data-testid={`service-card-${service.id}`}
        >
          <div className="aspect-video overflow-hidden">
            <img
              src={service.image_url}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition">
              {service.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {service.description}
            </p>
            <div className="mb-4">
              <span className="text-2xl font-bold text-sky-600">
                {service.pricing_model === 'per_minute'
                  ? `$${service.base_price}/min`
                  : `From $${service.base_price}`}
              </span>
              {service.price_description && (
                <p className="text-sm text-gray-500 mt-1">{service.price_description}</p>
              )}
            </div>
            <Link
              to={`/services/${service.id}`}
              className="inline-flex items-center justify-center gap-2 w-full text-center bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition-all duration-200 shadow-md hover:shadow-lg group"
            >
              Learn More
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

3. **ПОЛНОСТЬЮ ЗАМЕНИТЬ** этот блок на:

```jsx
{/* Services Overview */}
<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Our <span className="text-ocean">Video Services</span>
      </h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        Three waves of creativity to bring your vision to life
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {services.map((service, index) => (
        <div 
          key={service.id} 
          className="card-ocean group hover:scale-105 transition-transform duration-300"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="aspect-video overflow-hidden">
            <img 
              src={service.image_url} 
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition">
              {service.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3">
              {service.description}
            </p>
            <div className="mb-4">
              <span className="text-2xl font-bold text-sky-600">
                {service.pricing_model === 'per_minute' ? `$${service.base_price}/min` : `From $${service.base_price}`}
              </span>
              <p className="text-sm text-gray-500 mt-1">{service.price_description}</p>
            </div>
            <Link 
              to={`/services/${service.id}`}
              className="inline-block w-full text-center bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-teal-600 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

**ВАЖНО**:
- Комментарий: `{/* Services Overview */}` (НЕ `{/* ====== 2. SERVICES OVERVIEW ====== */}`)
- НЕТ `id="services"`, `data-testid="services-section"`, `data-testid="service-card-${service.id}"`
- Кнопка "Learn More": `bg-gradient-to-r from-sky-500 to-teal-500` (градиент, НЕ `bg-sky-600`)
- Кнопка "Learn More": `inline-block w-full text-center` (БЕЗ иконки стрелки, БЕЗ `inline-flex`, `gap-2`, `<svg>`)
- animationDelay: `${index * 100}ms` (параметр `index` из `.map((service, index) => ...)`)
- price_description: ВСЕГДА показывается (БЕЗ `{service.price_description && ...}`)

**КАРТИНКИ (`service.image_url`) — НЕ ТРОГАТЬ!** Они приходят из API и в O2J2 более удачные.

**РЕФЕРЕНС**: См. `CODE_REFERENCE_ServicesOverview.md`.

---

## ✅ ЧЕКЛИСТ ДЛЯ ИСПОЛНИТЕЛЯ

Перед отправкой отчёта проверь:

- [ ] Комментарий `{/* Services Overview */}` (короткий формат)
- [ ] НЕТ атрибутов `id="services"`, `data-testid`
- [ ] Кнопка "Learn More" использует градиент `bg-gradient-to-r from-sky-500 to-teal-500`
- [ ] Кнопка "Learn More" НЕ содержит иконку стрелки (`<svg>`)
- [ ] Кнопка "Learn More" использует `inline-block w-full text-center` (НЕ `inline-flex`)
- [ ] animationDelay использует параметр `index` (НЕ `services.indexOf(service)`)
- [ ] price_description показывается БЕЗ условной проверки
- [ ] Картинки (`service.image_url`) НЕ изменены

---

## 📦 ФАЙЛЫ ДЛЯ ОТЧЁТА

После выполнения задачи отправь в папку `task_012`:

1. **SCREENSHOTS** (ОБЯЗАТЕЛЬНО!):
   - `services_desktop_before.png` — Services Overview ПЕРЕД изменениями
   - `services_desktop_after.png` — Services Overview ПОСЛЕ изменений
   - `button_comparison.png` (опционально) — Сравнение кнопок "Learn More" (до/после)

2. **COMPLETION_REPORT.md** — Отчёт о выполнении с отметками о каждой директиве.

---

## 🚨 ANTI-CHECKLIST (НЕ ДЕЛАЙ!)

- ❌ НЕ меняй картинки (`service.image_url`)
- ❌ НЕ добавляй свои "улучшения" или "оптимизации"
- ❌ НЕ оставляй атрибуты `data-testid`
- ❌ НЕ используй `bg-sky-600` для кнопки "Learn More"
- ❌ НЕ добавляй иконку стрелки в кнопку
- ❌ НЕ забудь приложить скриншоты (минимум 2 штуки)

---

**Удачи! Строго следуй директивам.**