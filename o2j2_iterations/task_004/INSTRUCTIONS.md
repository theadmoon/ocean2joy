# 🎯 TASK #004: Точная визуальная калибровка до 99%

**Приоритет**: **P0 (КРИТИЧЕСКИЙ)**  
**Дата**: 2025-12-XX  
**Архитектор**: Main Agent  
**Исполнитель**: Executor Agent  

---

## 📋 КОНТЕКСТ

Task #003 восстановил **структуру** на 100% (все 6 секций, API, react-icons), но **визуальные детали** совпадают только на ~20%.

**Проблема**: Все заголовки меньше на 25-50%, spacings сжаты, отсутствуют эмодзи и теги, кнопки упрощены.

**Цель**: Довести до **99% визуальной идентичности** с `/app/frontend/src/pages/Homepage.js`

---

## 📂 ФАЙЛ ДЛЯ ПРАВКИ

**Путь**: `/tmp/O2J2/frontend/src/pages/Homepage.jsx`

**Метод**: Применить точечные правки через `search_replace`  
**Эталон**: `/app/frontend/src/pages/Homepage.js` (506 строк)

---

## 🔧 ТОЧЕЧНЫЕ ПРАВКИ (30 изменений)

### 🎯 СЕКЦИЯ 2: SERVICES OVERVIEW

#### Правка 2.1: Контейнер

**НАЙТИ** (строка ~117):
```jsx
<div className="max-w-6xl mx-auto">
```

**ЗАМЕНИТЬ НА**:
```jsx
<div className="max-w-7xl mx-auto">
```

---

#### Правка 2.2: Обертка заголовка

**НАЙТИ** (строки ~118-124):
```jsx
      <section className="py-20 px-4" id="services" data-testid="services-section">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Our <span className="text-ocean">Video Services</span>
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            Three waves of creativity to bring your vision to life
          </p>
```

**ЗАМЕНИТЬ НА**:
```jsx
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
```

---

#### Правка 2.3: Карточка сервиса (изображение)

**НАЙТИ** (строки ~127-132):
```jsx
              <div key={service.id} className="card-ocean group hover:scale-105 transition-transform" data-testid={`service-card-${service.id}`}>
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
```

**ЗАМЕНИТЬ НА**:
```jsx
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
```

---

#### Правка 2.4: Контент карточки

**НАЙТИ** (строки ~133-146):
```jsx
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sky-600 font-bold text-lg">From ${service.base_price}</span>
                    <Link
                      to={`/projects/new`}
                      className="text-sky-600 hover:text-sky-800 font-semibold text-sm transition"
                    >
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
```

**ЗАМЕНИТЬ НА**:
```jsx
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
                    className="inline-block w-full text-center bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-teal-600 transition"
                  >
                    Learn More
                  </Link>
                </div>
```

---

### 🎯 СЕКЦИЯ 3: WHY CHOOSE US

#### Правка 3.1: Заголовок секции

**НАЙТИ** (строки ~153-160):
```jsx
      <section className="py-20 px-4 ocean-gradient-light" data-testid="why-choose-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Why Ride the <span className="text-ocean">Ocean2Joy Wave?</span>
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            We bring expertise, creativity, and reliability to every project
          </p>
```

**ЗАМЕНИТЬ НА**:
```jsx
      <section className="py-20 px-4 ocean-gradient-light" data-testid="why-choose-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Ride the <span className="text-ocean">Ocean2joy Wave?</span>
            </h2>
          </div>
```

**ПРИМЕЧАНИЕ**: Убираем подзаголовок (его нет в оригинале).

---

#### Правка 3.2: Карточки преимуществ

**НАЙТИ** (строки ~168-175):
```jsx
              <div key={i} className="text-center" data-testid={`why-card-${i}`}>
                <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <item.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
```

**ЗАМЕНИТЬ НА**:
```jsx
              <div key={i} className="text-center" data-testid={`why-card-${i}`}>
                <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <item.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
```

---

### 🎯 СЕКЦИЯ 4: DEMO VIDEOS

#### Правка 4.1: Заголовок секции

**НАЙТИ** (строки ~181-186):
```jsx
      <section className="py-20 px-4" data-testid="demo-videos-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            See Our <span className="text-ocean">Work in Action</span>
          </h2>
          <p className="text-gray-500 text-center mb-12">Sample projects that showcase our capabilities</p>
```

**ЗАМЕНИТЬ НА**:
```jsx
      <section className="py-20 px-4" data-testid="demo-videos-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              See Our <span className="text-ocean">Work in Action</span>
            </h2>
            <p className="text-xl text-gray-600">Sample projects that showcase our capabilities</p>
          </div>
```

---

#### Правка 4.2: Vimeo iframe + теги

**НАЙТИ** (строки ~210-220, первое Vimeo видео):
```jsx
                <div className="card-ocean">
                  <iframe
                    src="https://player.vimeo.com/video/115098447?..."
                    className="w-full h-64"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Custom Video</h3>
                    <p className="text-gray-600">Example of our custom video production...</p>
                  </div>
                </div>
```

**ЗАМЕНИТЬ НА**:
```jsx
                <div className="card-ocean">
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    <iframe
                      src="https://player.vimeo.com/video/115098447?background=1&autoplay=0&loop=0&byline=0&title=0"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="Custom Video Production Demo"
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Custom Video</h3>
                    <p className="text-gray-600">Example of our custom video production with professional actors and crew</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">Drama</span>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Professional</span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">HD Quality</span>
                    </div>
                  </div>
                </div>
```

---

#### Правка 4.3: Второе Vimeo видео + теги

**НАЙТИ** (второе Vimeo видео):
```jsx
                <div className="card-ocean">
                  <iframe src="https://player.vimeo.com/video/342333493?..." />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Creation</h3>
                    <p className="text-gray-600">Example of our cutting-edge AI-generated video...</p>
                  </div>
                </div>
```

**ЗАМЕНИТЬ НА**:
```jsx
                <div className="card-ocean">
                  <div className="aspect-video bg-gray-900 relative overflow-hidden">
                    <iframe
                      src="https://player.vimeo.com/video/342333493?background=1&autoplay=0&loop=0&byline=0&title=0"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title="AI-Generated Video Demo"
                    ></iframe>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Creation</h3>
                    <p className="text-gray-600">Example of our cutting-edge AI-generated video content with digital effects</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded">AI Tech</span>
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Innovative</span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Digital</span>
                    </div>
                  </div>
                </div>
```

---

#### Правка 4.4: Примечание о демо-видео

**НАЙТИ** (после закрывающего `</>` fallback):
```jsx
          </div>
        </div>
      </section>
```

**ЗАМЕНИТЬ НА**:
```jsx
          </div>

          {/* Note about demo videos */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 italic">
              * Demo videos are representative examples. Your custom project will be created specifically for your needs.
            </p>
          </div>
        </div>
      </section>
```

---

### 🎯 СЕКЦИЯ 5: PAYMENTS

#### Правка 5.1: Заголовок секции

**НАЙТИ** (строки ~255-260):
```jsx
      <section className="py-20 px-4 bg-gray-50" data-testid="payments-section">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Payments</h2>
          <p className="text-gray-500 text-center mb-12">
            Payment systems are currently not integrated. Payments are processed in semi-manual mode.
          </p>
```

**ЗАМЕНИТЬ НА**:
```jsx
      <section className="py-20 px-4 bg-gray-50" data-testid="payments-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Payments
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Payment systems are currently not integrated. Payments are processed in semi-manual mode. 
              Once you confirm your order, you'll receive payment details directly in your project portal.
            </p>
          </div>
```

---

#### Правка 5.2: Bank Transfer Card (эмодзи + структура)

**НАЙТИ** (строки ~264-280, Bank Transfer Card):
```jsx
              <div className="card-ocean p-8" data-testid="payment-bank">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-sky-600 font-bold text-lg">B</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Bank Transfer</h3>
                </div>
```

**ЗАМЕНИТЬ НА**:
```jsx
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-sky-100" data-testid="payment-bank">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-teal-400 rounded-full flex items-center justify-center">
                    <span className="text-3xl">🏦</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                  Bank Transfer (SWIFT)
                </h3>
```

---

#### Правка 5.3: Bank Transfer данные (bg-sky-50 обертка)

**НАЙТИ** (строки ~281-310, поля банка):
```jsx
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Beneficiary</span>
                    <span className="font-medium text-gray-900">{paymentSettings.beneficiary}</span>
                  </div>
                  {/* остальные поля */}
                </div>
```

**ЗАМЕНИТЬ НА**:
```jsx
                <div className="bg-sky-50 rounded-lg p-4 mb-4 text-sm space-y-3">
                  <div>
                    <p className="font-semibold text-gray-700">Beneficiary Bank:</p>
                    <p className="text-gray-900">{paymentSettings.bank_name}</p>
                    <p className="text-gray-600 text-xs">{paymentSettings.bank_location}</p>
                    <p className="text-gray-600 text-xs">SWIFT: {paymentSettings.swift}</p>
                  </div>
                  
                  <div className="border-t border-sky-200 pt-2">
                    <p className="font-semibold text-gray-700">IBAN:</p>
                    <p className="text-gray-900 font-mono text-base break-all">
                      {paymentSettings.iban}
                    </p>
                  </div>
                  
                  <div className="border-t border-sky-200 pt-2">
                    <p className="font-semibold text-gray-700">Beneficiary:</p>
                    <p className="text-gray-900">{paymentSettings.beneficiary}</p>
                  </div>
                  
                  {paymentSettings.intermediary_bank && (
                    <div className="border-t border-sky-200 pt-2">
                      <p className="font-semibold text-gray-700 mb-1">Intermediary Banks:</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p>1. {paymentSettings.intermediary_bank}</p>
                        <p className="ml-3">SWIFT: {paymentSettings.intermediary_swift}</p>
                      </div>
                    </div>
                  )}
                </div>

                {paymentSettings.qr_code_url && (
                  <div className="text-center">
                    <a 
                      href={`${BACKEND_URL}${paymentSettings.qr_code_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition text-sm font-semibold"
                    >
                      📱 View QR Code
                    </a>
                  </div>
                )}
```

---

#### Правка 5.4: PayPal Card (эмодзи + структура)

**НАЙТИ** (строки ~320-340, PayPal Card):
```jsx
              <div className="card-ocean p-8" data-testid="payment-paypal">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-lg">P</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">PayPal</h3>
                </div>
                <p className="text-gray-500 text-sm mb-4">Send payment to:</p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="font-mono text-sky-600 font-medium">{paymentSettings.paypal_email}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>1. Log in to your PayPal account</p>
                  <p>2. Select "Send Money"</p>
                  <p>3. Enter the email address above</p>
                  <p>4. Specify the invoice amount in USD</p>
                  <p>5. Add your project number in the note</p>
                </div>
              </div>
```

**ЗАМЕНИТЬ НА**:
```jsx
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100" data-testid="payment-paypal">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl">💳</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
                  PayPal
                </h3>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-4 text-sm space-y-3">
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">Send payment to:</p>
                    <p className="text-gray-900 font-mono text-base break-all bg-white px-3 py-2 rounded border border-blue-200">
                      {paymentSettings.paypal_email}
                    </p>
                  </div>
                  
                  <div className="border-t border-blue-200 pt-3">
                    <p className="font-semibold text-gray-700 mb-2">Instructions:</p>
                    <ul className="space-y-1 text-gray-700 text-xs">
                      <li>✓ Include your project reference number</li>
                      <li>✓ Add invoice number in payment notes</li>
                      <li>✓ Mark payment as completed in your portal</li>
                      <li>✓ Production starts after confirmation</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 text-xs text-blue-900">
                  <p className="font-semibold mb-1">💡 Quick & Easy</p>
                  <p>PayPal payments are typically confirmed faster than bank transfers.</p>
                </div>
              </div>
```

---

#### Правка 5.5: "How Payment Works" блок

**НАЙТИ** (строки ~355-375):
```jsx
          <div className="bg-gray-50 rounded-xl p-8 max-w-3xl mx-auto" data-testid="payment-info">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-6">How Payment Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm">
              <div>
                <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-sky-600 font-bold">1</span>
                </div>
                <p className="text-gray-700 font-medium">Receive Invoice</p>
                <p className="text-gray-400 text-xs mt-1">We send you a detailed invoice</p>
              </div>
              {/* 2 других шага */}
            </div>
          </div>
```

**ЗАМЕНИТЬ НА**:
```jsx
          <div className="mt-8 bg-white rounded-xl shadow-md p-6 border-l-4 border-sky-500" data-testid="payment-info">
            <div className="flex items-start gap-4">
              <div className="text-3xl">ℹ️</div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">How Payment Works</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  After you accept our quote, you'll receive complete payment details in your client dashboard. 
                  Simply copy the payment information, make the transfer using your preferred method, and mark it as paid in your portal. 
                  We'll verify the payment and immediately start production. You'll receive transaction documents (Invoice, Receipt, Certificate) at each stage.
                </p>
              </div>
            </div>
          </div>
```

---

### 🎯 СЕКЦИЯ 6: CTA

#### Правка 6.1: Контейнер и заголовок

**НАЙТИ** (строки ~367-373):
```jsx
      <section className="py-20 px-4 ocean-gradient text-white" data-testid="cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Make Waves?</h2>
          <p className="text-xl text-sky-100 mb-8">
            Start your video project today and let us bring your vision to life
          </p>
```

**ЗАМЕНИТЬ НА**:
```jsx
      <section className="py-20 px-4 ocean-gradient text-white" data-testid="cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make Waves?
          </h2>
          <p className="text-xl mb-8 text-sky-50">
            Start your video project today. Quick request form takes less than 2 minutes.
          </p>
```

---

#### Правка 6.2: Кнопка и ссылки

**НАЙТИ** (строки ~374-383):
```jsx
          <Link
            to={user && user.id ? "/projects/new" : "/register"}
            className="bg-yellow-400 text-gray-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105 inline-flex items-center justify-center"
            data-testid="cta-button"
          >
            <FaRocket className="mr-2" /> Get Started Now
          </Link>
          <p className="mt-6 text-sky-200 text-sm">
            Or <Link to="/login" className="underline hover:text-white">contact us</Link> to discuss your project first
          </p>
```

**ЗАМЕНИТЬ НА**:
```jsx
          <Link 
            to="/request"
            className="inline-block bg-yellow-400 text-gray-900 px-10 py-4 rounded-lg font-bold text-xl hover:bg-yellow-300 transition shadow-2xl hover:shadow-yellow-400/50 transform hover:scale-105"
            data-testid="cta-button"
          >
            Get Started Now
          </Link>
          <p className="mt-6 text-sky-100 text-sm">
            Or <Link to="/contact" className="underline hover:text-white">contact us</Link> to discuss your project
          </p>
```

---

## ✅ КРИТЕРИИ ПРИЕМКИ

После всех правок:

- [ ] Все заголовки секций: `text-4xl md:text-5xl`
- [ ] Все контейнеры: `max-w-7xl` (кроме Payments: `max-w-5xl`, CTA: `max-w-4xl`)
- [ ] Карточки сервисов:
  - [ ] `aspect-video` с hover-зумом
  - [ ] Заголовок: `text-2xl`
  - [ ] Цена: `text-2xl`
  - [ ] Градиентная кнопка "Learn More"
- [ ] Payments:
  - [ ] Эмодзи 🏦 и 💳
  - [ ] Заголовки карточек: `text-2xl text-center`
  - [ ] Иконки: `w-16 h-16 text-3xl`
  - [ ] QR-код для банка
- [ ] Demo Videos:
  - [ ] Теги под каждым Vimeo
  - [ ] Примечание внизу
- [ ] CTA:
  - [ ] Кнопка: `text-xl` (не `text-lg`)
  - [ ] Ссылка: `/request` (не `/projects/new`)

---

## 📝 ОТЧЕТ ОБ ИСПОЛНЕНИИ

После выполнения Task #004:

1. **Screenshot** полной главной страницы (со всеми секциями)
2. **Git diff** или список строк, которые были изменены
3. **Визуальное сравнение** с оригиналом

---

**Ожидаемое время**: 2-3 часа  
**Дедлайн**: Немедленно (P0)

---

**Архитектор**: Main Agent  
**Статус**: ⏳ ОЖИДАЕТ ИСПОЛНЕНИЯ
