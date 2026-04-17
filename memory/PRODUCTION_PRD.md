# Ocean2Joy Production - Product Requirements Document

## 📋 Project Overview

**Project Name:** Ocean2Joy Production Platform  
**Type:** Digital Video Production Service Management System  
**Tech Stack:** React + FastAPI + MongoDB  
**Target:** Production-ready, scalable, multi-client platform

---

## 🎯 Core Business Model

### Legal Entity
- **Company:** Individual Entrepreneur Vera Iambaeva
- **Tax ID:** 302335809
- **Country:** Georgia
- **Brand:** Ocean2Joy Digital Video Production

### Service Model
- **Type:** Digital-only service (NO physical shipping)
- **Delivery:** Electronic via secure client portal
- **Payment:** Post-payment via PayPal
- **Compliance:** OS.1 v2.0 directive (verifiable digital service chain)

---

## 👥 User Roles

### 1. **Client (Customer)**
**Can:**
- Browse service tiers and pricing
- Submit project requests via forms
- Upload scripts and reference materials
- Track project progress in real-time
- Download deliverables
- Sign documents electronically
- Chat with production team
- Make payments

**Cannot:**
- Access other clients' projects
- Modify pricing or invoices
- Change project status

### 2. **Admin/Manager**
**Can:**
- Create client accounts manually
- Initiate new projects for clients
- Review and approve project requests
- Generate quotes and invoices
- Update project status
- Upload deliverables
- Confirm payments
- Manage all documentation

**Cannot:**
- Delete completed projects (audit trail)
- Modify signed documents

---

## 🎬 Service Tiers

### Tier 1: Basic Video Production
- **Price Range:** $500-750 USD
- **Duration:** Up to 15 minutes
- **Features:** 1 actor, basic editing

### Tier 2: Standard Video Production
- **Price Range:** $750-1050 USD
- **Duration:** 15-30 minutes
- **Features:** 2 actors, special effects

### Tier 3: Premium Video Production
- **Price Range:** $1050-2000 USD
- **Duration:** 30+ minutes
- **Features:** Multiple actors, advanced VFX

---

## 📊 Operational Chain (12 Stages)

### 1. **Submitted**
- Client fills request form
- System generates Quote Request document

### 2. **Order Activated**
- Client uploads materials (script, references)
- System generates Order Confirmation
- Manager adds notes

### 3. **Invoice Sent**
- Manager reviews materials
- System generates quote ($XXX USD)
- Invoice document created

### 4. **Invoice Signed**
- Client reviews and signs invoice electronically
- Payment terms confirmed

### 5. **Production Started**
- Manager initiates production
- Production Notes document created
- Timeline: auto-calculated

### 6. **Delivered**
- Production complete
- Final video uploaded to portal
- Client notified

### 7. **Files Accessed**
- Client downloads files
- System logs download confirmation

### 8. **Delivery Confirmed**
- Client signs Digital Delivery Certificate
- Confirms file accessibility

### 9. **Work Accepted**
- Client signs Acceptance Act
- Quality confirmation (NOT acceptance of payment terms)

### 10. **Payment Sent**
- Client uploads Payment Proof
- PayPal transaction ID recorded

### 11. **Payment Received**
- Manager confirms payment receipt
- Payment Confirmation document generated

### 12. **Completed**
- All documents signed
- Certificate of Completion issued
- Project archived

---

## 📄 Document Types (15 Total)

### Auto-Generated Documents:
1. **Quote Request** - Initial inquiry
2. **Order Confirmation** - Materials uploaded
3. **Invoice** - Project quote
4. **Production Notes** - Production timeline
5. **Delivery Certificate** - Electronic delivery proof
6. **Download Confirmation** - File access log
7. **Acceptance Act** - Quality acceptance
8. **Payment Instructions** - PayPal details
9. **Payment Confirmation** - Payment verified
10. **Receipt** - PayPal transaction record
11. **Certificate of Completion** - Project closure

### Client-Uploaded Documents:
12. **Script** (PDF/DOC)
13. **Reference Materials** (ZIP/PDF)
14. **Payment Proof** (PDF/Screenshot)

### Admin-Created Documents:
15. **Manager Notes** (Text)

---

## 🔐 Document Requirements

### All Documents Must Include:
- Legal entity: Individual Entrepreneur Vera Iambaeva
- Tax ID: 302335809
- Country of Registration: Georgia
- Clear statement: "Digital service only, no physical shipment"
- PayPal dispute protection language
- Electronic signature fields

### Document Formats:
- **PDF:** Styled, branded, downloadable
- **TXT:** Plain text for preview/email

### Document Numbering Format:
`VAPP{project_sequence}-{DOC_TYPE}-{sequence}-{YYMMDD}`

Example: `VAPP6-INV-0002-260217`

---

## 💬 Communication System

### Chat Features:
- **Real-time messaging** between client and team
- **No file attachments** (files only in Operational Chain)
- **UTC timestamps** for all messages
- **Role indicators** (Client / Ocean2joy Team)
- **Persistent history** (never deleted)

### Chat Flow Example:
1. Client: Initial inquiry
2. Manager: Price range + request activation
3. Client: Confirms activation
4. Manager: Invoice ready, see Operational Chain
5. Client: Confirms acceptance
6. Manager: Production timeline available
... (continues through project lifecycle)

---

## 🎨 Design Requirements

### Brand Identity:
- **Primary Color:** Ocean blue (#0ea5e9)
- **Secondary:** Warm accents (#f59e0b)
- **Style:** Modern, professional, trustworthy
- **Typography:** Clean, readable

### UI Principles:
- **Mobile-first** responsive design
- **Clear information hierarchy**
- **Minimal cognitive load**
- **Progress indicators** everywhere
- **Single source of truth** (Operational Chain)

---

## 🔧 Technical Requirements

### Performance:
- Page load: < 2 seconds
- API response: < 500ms
- Document generation: < 3 seconds
- Real-time updates via WebSocket (future)

### Security:
- JWT authentication
- Role-based access control (RBAC)
- Encrypted file storage
- Audit logs for all actions
- GDPR compliance ready

### Scalability:
- Support 100+ concurrent clients
- Handle 1000+ projects
- Document storage: cloud-ready
- MongoDB indexes optimized

---

## 📱 Key User Journeys

### Client Journey:
1. Browse services → Choose tier
2. Submit request form → Upload materials
3. Receive quote → Sign invoice
4. Track production → Download files
5. Sign delivery docs → Make payment
6. Receive completion certificate

### Admin Journey:
1. Review new request → Add notes
2. Generate quote → Send invoice
3. Wait for signature → Start production
4. Upload deliverables → Mark delivered
5. Confirm payment → Close project

---

## 🚫 What to EXCLUDE from Production

### Remove All Hardcoded Test Data:
- ❌ Marcos Knight test user
- ❌ Hardcoded project VAPP-6
- ❌ Fixed dates and times
- ❌ Lorem ipsum placeholders
- ❌ Development-only features

### Remove Technical Debt:
- ❌ Commented-out code
- ❌ Unused imports
- ❌ Duplicate functions
- ❌ Console.log statements
- ❌ TODO comments without tickets

---

## ✅ Must-Have Features for Production

### Phase 1 (MVP):
1. ✅ User authentication (JWT)
2. ✅ Client dashboard
3. ✅ Admin dashboard
4. ✅ Project creation flow
5. ✅ Operational Chain display
6. ✅ Document generation (PDF + TXT)
7. ✅ File upload system
8. ✅ Payment tracking
9. ✅ Chat system

### Phase 2 (Post-Launch):
- [ ] Email notifications
- [ ] WebSocket real-time updates
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Mobile app

---

## 📈 Success Metrics

### Business KPIs:
- **Conversion Rate:** Request → Paid Project
- **Average Project Value:** $XXX USD
- **Client Satisfaction:** NPS score
- **Payment Time:** Days from delivery to payment

### Technical KPIs:
- **Uptime:** 99.9%
- **Response Time:** < 500ms
- **Error Rate:** < 0.1%
- **Document Generation Success:** 100%

---

## 🎓 Key Principles

1. **Transparency:** Client sees everything in Operational Chain
2. **Simplicity:** One click for most actions
3. **Trust:** All documents are professional and legally sound
4. **Speed:** Instant updates, no waiting
5. **Reliability:** Nothing breaks, ever

---

## 📝 Notes for Implementation

### Critical Rules:
- **NEVER** hardcode credentials or keys
- **ALWAYS** use environment variables
- **ALWAYS** validate user input
- **NEVER** expose internal IDs to clients
- **ALWAYS** log all state changes

### Code Quality:
- TypeScript for frontend (optional but recommended)
- Pydantic models for all data
- Comprehensive error handling
- Unit tests for critical paths
- API documentation (Swagger/OpenAPI)

---

**This PRD serves as the blueprint for Ocean2Joy Production platform. All features must align with these requirements.**
