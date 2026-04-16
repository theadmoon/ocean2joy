# Product Requirements Document (PRD)
## Ocean2joy.com - Digital Video Production Platform

**Version**: 2.0  
**Last Updated**: April 16, 2026  
**Project**: OS.1 v2.0 Compliant Operational Chain

---

## 1. PRODUCT OVERVIEW

Ocean2joy.com is a digital video production platform that provides custom video creation, editing, and AI-generated video services delivered entirely electronically through a secure client portal.

### Core Principle: OS.1 v2.0 Compliance
The platform operates as a **verifiable digital-service operational chain** with **no physical shipping narrative**. All deliverables are digital files accessed via secure portal.

---

## 2. SERVICE TIERS

### Tier 1: Custom Video Production
- Professional filming with actors
- Custom scripts and scenarios
- Special effects and post-production
- Duration: Flexible (typically 15-60 minutes)
- Pricing: Custom quotes based on complexity

### Tier 2: Video Editing Services
- Client provides raw footage
- Professional editing and post-production
- Color grading, sound design
- Multiple format exports

### Tier 3: AI-Generated Video
- AI-powered content creation
- Quick turnaround
- Template-based or custom prompts
- Cost-effective option

---

## 3. USER ROLES

### Client
- Submit project requests
- Upload materials (scripts, references)
- Activate orders with payment method selection
- Download deliverables
- Upload signed documents (Invoice, Acceptance Act)
- Upload payment proof
- View project timeline and status

### Manager
- Review client requests
- Prepare quotes and invoices
- Upload deliverables
- Confirm payments
- Communicate with clients

### Admin
- Full system access
- Create client accounts and projects
- Manage payment settings
- System configuration

---

## 4. OS.1 v2.0 OPERATIONAL CHAIN

### Complete 11-Step Chain:

1. **Submitted** — Initial request received
2. **Order Activated** — Client submits materials, brief, and payment method
3. **Invoice Sent** — Manager prepares and sends invoice
4. **Invoice Signed** — Client downloads, signs, and uploads invoice
5. **Production Started** — Work begins on video creation
6. **Delivered** — Final deliverables available in portal
7. **Files Accessed** — Client confirms file download
8. **Work Accepted** — Client signs and uploads Acceptance Act
9. **Payment Sent** — Client uploads payment proof
10. **Payment Received** — Manager confirms payment
11. **Completed** — Project closed

---

## 5. DOCUMENT WORKFLOW

### System-Generated Documents:
- Quote Request
- Invoice
- Acceptance Act
- Payment Instructions
- Receipt
- Completion Certificate

### Client-Uploaded Documents:
- Scripts and reference materials
- Signed Invoice (PDF)
- Signed Acceptance Act (PDF)
- Payment Proof (screenshot/PDF)

### File Storage:
- **Location**: Local server storage (`/app/backend/uploads/`)
- **Structure**:
  - `/invoices/` — Signed invoices
  - `/acceptance_acts/` — Signed acceptance documents
  - `/payment_proofs/` — Payment confirmations
  - `/client_materials/` — Scripts and references
  - `/generated_documents/` — System-generated docs

---

## 6. PAYMENT WORKFLOW

### Supported Payment Methods:
1. **PayPal** — Account: `302335809@postbox.ge`
2. **SWIFT Transfer** — International bank transfer (USD)
3. **QR Code** — Local payment (GEL)

### Payment Terms:
- **100% post-payment** (invoice issued after delivery)
- Payment confirms acceptance of delivered materials
- No refunds after delivery completion
- Client uploads payment proof → Manager confirms receipt

---

## 7. KEY FEATURES IMPLEMENTED

### ✅ Authentication System
- JWT-based auth with bcrypt password hashing
- Role-based access control (Client, Manager, Admin)
- Session management

### ✅ Order Activation Form
- Auto-collapsing UI after submission
- Read-only audit trail
- Fields: Project Brief, Materials Upload, Payment Method Selection

### ✅ Real File Storage System
- Local disk storage for all documents
- Upload/Download functionality
- Document generation (Invoice, Acceptance Act, Payment Instructions)

### ✅ Operational Chain Display
- Visual timeline with 11 steps
- Document cards for each step
- View/Download/Upload buttons
- Status indicators (Completed, In Progress, Pending)

### ✅ Document Generation Utility
- Centralized `documentGenerators.js`
- High-quality templates
- Proper email differentiation:
  - PayPal: `302335809@postbox.ge`
  - Contact: `ocean2joy@gmail.com`

---

## 8. TECHNICAL STACK

### Frontend:
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **HTTP Client**: Axios
- **Routing**: React Router v6

### Backend:
- **Framework**: FastAPI (Python 3.11)
- **Database**: MongoDB (Motor async driver)
- **Authentication**: JWT + bcrypt
- **File Handling**: UploadFile, FileResponse
- **Logging**: Python logging module

### Infrastructure:
- **Deployment**: Kubernetes (hot reload enabled)
- **Frontend Port**: 3000 (Nginx proxy)
- **Backend Port**: 8001 (internal)
- **Database**: MongoDB (via `MONGO_URL`)
- **Supervisor**: Process management

---

## 9. API ENDPOINTS

### Authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`

### Projects:
- `GET /api/projects` — Get all projects
- `GET /api/projects/{project_id}` — Get project details
- `POST /api/projects/{project_id}/upload-materials` — Upload scripts/materials
- `PATCH /api/projects/{project_id}/activate-order` — Activate order

### Documents (NEW):
- `GET /api/projects/{project_id}/documents/{doc_type}/generate` — Generate & download document
- `POST /api/projects/{project_id}/documents/{doc_type}/upload` — Upload signed document
- `GET /api/projects/{project_id}/documents/{doc_type}/download` — Download uploaded document

Supported `doc_type`: `invoice`, `acceptance_act`, `payment_proof`, `payment_instructions`, `receipt`, `certificate`

### Admin:
- `GET /api/admin/projects` — All projects
- `PATCH /api/admin/projects/{project_id}` — Update project
- `POST /api/admin/users/create` — Create client account (TODO)

---

## 10. CURRENT PENDING TASKS

### P0 (Critical):
- ✅ Real file storage implementation — **COMPLETED**
- ⏳ Admin UI for creating clients/projects manually

### P1 (High Priority):
- Backend endpoints for all document types
- Enhanced error handling for file operations

### P2 (Medium):
- Remove temporary "Quick Switch" from Navbar
- PDF generation (currently using TXT)

### P3 (Low):
- Delete obsolete files (`ProjectDocuments.js`, `ProjectDeliverables.js`)
- Code refactoring (routes, models separation)

---

## 11. TEST CREDENTIALS

### Admin Account:
```
Email: admin@ocean2joy.com
Password: admin123
```

### Test Client (Marcos Knight):
```
Email: mek110@yahoo.com
Password: marcos2026
Project: VAPP-6-Custom1050USD-13Mar2026
Status: Completed (all OS.1 v2.0 steps)
```

---

## 12. COMPLIANCE & LEGAL

### OS.1 v2.0 Requirements:
✅ Electronic delivery only (no physical shipment)  
✅ Buyer-specific handoff (`files_accessed_at`)  
✅ Acceptance completion (`work_accepted_at`)  
✅ Payment confirmation (`payment_confirmed_by_admin_at`)  
✅ Digital audit trail  
✅ All documents timestamped and signed

### Terms:
- Payment confirms acceptance of delivered materials
- No refunds after delivery
- Client retains rights to final deliverables
- Ocean2Joy retains rights to raw footage/materials

---

## 13. FUTURE ENHANCEMENTS

1. **PDF Generation** — Replace TXT with proper PDF documents
2. **Digital Signatures** — E-signature integration (DocuSign)
3. **Email Notifications** — Automated emails for status changes
4. **Multi-language Support** — Russian, English, Georgian
5. **Mobile App** — React Native client portal
6. **Analytics Dashboard** — Revenue, project metrics
7. **Client Feedback System** — Ratings and reviews
8. **Revision Management** — Track revision requests

---

**Document Owner**: Product Development Team  
**Approval**: Management  
**Next Review**: Upon feature completion
