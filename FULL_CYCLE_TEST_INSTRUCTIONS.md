# 🎯 ПОЛНЫЙ ЦИКЛ ТЕСТИРОВАНИЯ Ocean2joy - OS.1 v2.0

## ✅ Что реализовано:

### Backend (Реальное файловое хранилище):
- ✅ Локальное хранилище файлов в `/app/backend/uploads/`
- ✅ Генерация документов (Invoice, Acceptance Act, Payment Instructions)
- ✅ Upload подписанных документов
- ✅ Download документов (сгенерированных и загруженных)

### Frontend:
- ✅ Кнопка Download — реальное скачивание файлов
- ✅ Кнопка Upload — реальная загрузка файлов
- ✅ View — отображение содержимого документов

---

## 📋 ИНСТРУКЦИИ ДЛЯ СИМУЛЯЦИИ ПОЛНОГО ЦИКЛА

### **Шаг 1: Логин как клиент Marcos**
```
URL: http://localhost:3000/login
Email: mek110@yahoo.com
Password: marcos2026
```

### **Шаг 2: Открыть проект**
- Dashboard → View Details для проекта `VAPP-6-Custom1050USD-13Mar2026`

### **Шаг 3: Скачать Invoice для подписания**
1. Прокрутить до секции "Operational Chain & Documents"
2. Найти шаг "**Invoice Sent**" (Feb 17, 2026)
3. Документ: **Invoice #VAPP**
4. Нажать иконку **Download** (стрелка вниз)
5. **Файл скачается**: `VAPP-6-Custom1050USD-13Mar2026_invoice.txt`

### **Шаг 4: "Подписать" Invoice**
- Откройте скачанный файл
- Добавьте в конец файла текст:
```
═══════════════════════════════════════════════
CLIENT SIGNATURE:
Name: Marcos Knight
Date: [текущая дата]
Signature: [Подпись]
CONFIRMED AND AGREED
```
- Сохраните файл как `signed_invoice.pdf` или `signed_invoice.txt`

### **Шаг 5: Загрузить подписанный Invoice**
1. В том же шаге "Invoice Sent"
2. Документ "Signed Invoice" имеет статус "Signed"
3. Нажать иконку **Upload** (фиолетовая стрелка вверх)
4. Выбрать файл `signed_invoice.pdf`
5. Нажать "Upload Document"
6. Дождаться сообщения: ✅ "Signed invoice uploaded successfully!"

### **Шаг 6: Скачать Acceptance Act**
1. Найти шаг "**Work Accepted**" (Mar 12, 2026)
2. Документ: **Acceptance Act**
3. Нажать иконку **Download**
4. **Файл скачается**: `VAPP-6-Custom1050USD-13Mar2026_acceptance_act.txt`

### **Шаг 7: "Подписать" Acceptance Act**
- Откройте файл
- Заполните секцию CLIENT SIGNATURE:
```
Name: Marcos Knight
Email: mek110@yahoo.com
Date: [текущая дата]
Signature: [Подпись]
```
- Сохраните как `signed_acceptance_act.pdf`

### **Шаг 8: Загрузить подписанный Acceptance Act**
1. В шаге "Work Accepted"
2. Нажать Upload для "Acceptance Act"
3. Выбрать `signed_acceptance_act.pdf`
4. Upload
5. ✅ "Acceptance act uploaded successfully!"

### **Шаг 9: Скачать Payment Instructions**
1. В том же шаге "Work Accepted"
2. Документ: **Payment Instructions**
3. Download
4. **Файл**: `VAPP-6-Custom1050USD-13Mar2026_payment_instructions.txt`
5. Откройте и скопируйте детали для PayPal:
   - Account: `302335809@postbox.ge`
   - Amount: $1050.00 USD
   - Reference: VAPP-6-Custom1050USD-13Mar2026

### **Шаг 10: Загрузить Payment Proof**
1. Создайте скриншот/файл с подтверждением оплаты
2. Или создайте текстовый файл:
```
PAYMENT PROOF - PayPal Transaction
Project: VAPP-6-Custom1050USD-13Mar2026
Amount: $1050.00 USD
Paid to: 302335809@postbox.ge
Transaction ID: TEST-TXID-123456
Date: [текущая дата]
Status: COMPLETED
```
3. Сохраните как `payment_proof.pdf`
4. Найдите шаг "**Payment Sent**" (Mar 13, 2026)
5. Нажмите Upload для "Payment Proof"
6. Выберите файл
7. ✅ "Payment proof uploaded successfully!"

---

## 🧪 ТЕСТИРОВАНИЕ ЧЕРЕЗ API (cURL)

### **1. Login и получение токена:**
```bash
API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"mek110@yahoo.com","password":"marcos2026"}' \
  | python3 -c "import sys,json;print(json.load(sys.stdin)['access_token'])")
echo "Token: ${TOKEN:0:30}..."
```

### **2. Скачать Invoice:**
```bash
curl -X GET "$API_URL/api/projects/ead900d9-33ab-4b22-9e72-20fbc1820bcc/documents/invoice/generate" \
  -H "Authorization: Bearer $TOKEN" \
  -o invoice.txt
cat invoice.txt
```

### **3. Загрузить подписанный Invoice:**
```bash
echo "SIGNED INVOICE - Marcos Knight VAPP-6" > signed_invoice.pdf
curl -X POST "$API_URL/api/projects/ead900d9-33ab-4b22-9e72-20fbc1820bcc/documents/invoice/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@signed_invoice.pdf"
```

### **4. Скачать Acceptance Act:**
```bash
curl -X GET "$API_URL/api/projects/ead900d9-33ab-4b22-9e72-20fbc1820bcc/documents/acceptance_act/generate" \
  -H "Authorization: Bearer $TOKEN" \
  -o acceptance_act.txt
cat acceptance_act.txt
```

### **5. Загрузить Acceptance Act:**
```bash
echo "SIGNED ACCEPTANCE ACT - Marcos Knight" > signed_acceptance.pdf
curl -X POST "$API_URL/api/projects/ead900d9-33ab-4b22-9e72-20fbc1820bcc/documents/acceptance_act/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@signed_acceptance.pdf"
```

### **6. Загрузить Payment Proof:**
```bash
echo "PAYMENT PROOF - PayPal $1050 USD" > payment_proof.pdf
curl -X POST "$API_URL/api/projects/ead900d9-33ab-4b22-9e72-20fbc1820bcc/documents/payment_proof/upload" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@payment_proof.pdf"
```

---

## 📁 Где находятся файлы на сервере:

```
/app/backend/uploads/
├── invoices/                    # Подписанные инвойсы от клиентов
├── acceptance_acts/             # Подписанные акты приемки
├── payment_proofs/              # Подтверждения оплаты
├── generated_documents/         # Сгенерированные документы для скачивания
└── confirmations/               # Старые подтверждения (legacy)
```

---

## ✅ Что проверить:

1. ✅ **Download работает** — файлы скачиваются с правильным содержимым
2. ✅ **Upload работает** — файлы сохраняются на сервере
3. ✅ **View показывает** — модалка отображает контент документов
4. ✅ **Проект обновляется** — даты `invoice_signed_at`, `work_accepted_at`, `payment_marked_by_client_at` устанавливаются корректно
5. ✅ **Файлы хранятся** — проверить `/app/backend/uploads/invoices/`, `/acceptance_acts/`, `/payment_proofs/`

---

## 🎉 **ПОЛНЫЙ ЦИКЛ ЗАВЕРШЕН!**

После выполнения всех шагов проект Marcos пройдет полный OS.1 v2.0 цикл:
- ✅ Submitted
- ✅ Order Activated
- ✅ Invoice Sent → Invoice Signed (с реальным файлом)
- ✅ Production Started
- ✅ Delivered
- ✅ Files Accessed
- ✅ Work Accepted (с реальным Acceptance Act)
- ✅ Payment Sent (с реальным Payment Proof)
- ✅ Payment Received
- ✅ Completed

---

**Дата создания**: April 16, 2026  
**Проект**: Ocean2joy OS.1 v2.0 Operational Chain  
**Статус**: ✅ Готов к тестированию
