# CODE REFERENCE: Services Overview Section

**Источник**: `/app/frontend/src/pages/Homepage.js` (Прототип Ocean2Joy)

---

## SERVICES OVERVIEW — ПОЛНЫЙ БЛОК (Строки 160-210)

**Текущая проблема в O2J2**:
- Комментарий: `{/* ====== 2. SERVICES OVERVIEW ====== */}` вместо `{/* Services Overview */}`
- Атрибуты: `id="services"`, `data-testid="services-section"`, `data-testid="service-card-${service.id}"`
- Кнопка "Learn More": градиент `bg-sky-600` вместо `bg-gradient-to-r from-sky-500 to-teal-500`
- Кнопка "Learn More": иконка стрелки вместо простого текста
- animationDelay: `services.indexOf(service)` вместо `index`

**Референсный код из прототипа**:

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
- Комментарий: `{/* Services Overview */}` (короткий формат)
- НЕТ атрибутов `id="services"`, `data-testid`
- Кнопка "Learn More": градиент `bg-gradient-to-r from-sky-500 to-teal-500`
- Кнопка "Learn More": `inline-block w-full text-center` (без иконки стрелки)
- animationDelay: `${index * 100}ms` (используется параметр `index` из `.map((service, index) => ...)`)
- Цена: всегда показывается `price_description` без проверки `{service.price_description && ...}`

---

## ЧТО НЕ ТРОГАТЬ

**КАРТИНКИ (image_url)** — НЕ ИЗМЕНЯТЬ!
Данные приходят из API `/api/services`, картинки в O2J2 более удачные. Код работает с `service.image_url` — это правильно, ничего не менять.