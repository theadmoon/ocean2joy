# FIXED PAYPAL DATA - DO NOT CHANGE

## ⚠️ CRITICAL: These values are fixed in PayPal and CANNOT be modified

### Project: VAPP-6-Custom1050USD-13Mar2026

**PayPal Transaction Details (LOCKED):**
- Transaction ID: `11S811AXV5482242W`
- Payment Date/Time: `13 March 2026 at 04:30:29 PDT` (UTC: 2026-03-13 11:30:29)
- Amount: `$1,050.00 USD`
- Payer Email: `marcos.knight@example.com`
- Transaction Status: `COMPLETED`
- Transaction Type: `Goods and Services`

**Note from Client (in PayPal):**
```
Customer film production according to client's script - Project Reference: VAPP-6-Custom1050USD-13Mar2026 100% post-payment I confirms successful receipt of the delivered digital materials and accepts that no refunds apply after delivery. Digital service delivered electronically
```

**Database Fields (DO NOT MODIFY):**
```python
{
    "paypal_transaction_id": "11S811AXV5482242W",
    "payment_marked_by_client_at": datetime(2026, 3, 13, 11, 30, 29, tzinfo=timezone.utc),  # 04:30:29 PDT
    "quote_amount": 1050.0,
    "paypal_payer_email": "marcos.knight@example.com",
    "paypal_payment_status": "COMPLETED",
    "project_number": "VAPP-6-Custom1050USD-13Mar2026"
}
```

## Other Fixed Dates (from operational chain, can adjust minutes only if needed):

**Can be adjusted (NOT in PayPal):**
- `order_activated_at`: Can use realistic time (e.g., 15:17)
- `files_accessed_at`: Can use realistic time (e.g., 16:42)
- `payment_confirmed_at`: Can use realistic time (but AFTER payment_marked_by_client_at)

**Rule:** Any time that appears in PayPal transaction = LOCKED FOREVER

## EMAIL CORRECTION

**FIXED:** PayPal payer email was using fake `@example.com` domain.

**Corrected:**
- ❌ Old (FAKE): `marcos.knight@example.com`
- ✅ New (REAL): `mek110@yahoo.com` (same as client email)

**Rule:** PayPal payer email = Client email (user_email)
