# Ocean2Joy Production - Technical Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Tablet     │      │
│  │  (React SPA) │  │  (Responsive)│  │ (Responsive) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      API GATEWAY TIER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            FastAPI Application Server                │   │
│  │  - JWT Authentication Middleware                     │   │
│  │  - CORS Configuration                                │   │
│  │  - Rate Limiting                                     │   │
│  │  - Request Validation (Pydantic)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC TIER                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Auth      │  │  Projects   │  │  Documents  │         │
│  │  Service    │  │  Service    │  │  Generator  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Messages   │  │  Payments   │  │    Files    │         │
│  │  Service    │  │  Service    │  │   Service   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA TIER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │  File Storage│  │  Redis Cache │      │
│  │  (Primary DB)│  │  (AWS S3 /   │  │  (Optional)  │      │
│  │              │  │   Local FS)  │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure (Production)

```
ocean2joy-production/
├── backend/
│   ├── __init__.py
│   ├── main.py                      # FastAPI app entry point
│   ├── config.py                    # Environment configuration
│   │
│   ├── models/                      # Pydantic models
│   │   ├── __init__.py
│   │   ├── user.py                  # User, Client models
│   │   ├── project.py               # Project model
│   │   ├── message.py               # Message model
│   │   ├── document.py              # Document metadata
│   │   └── payment.py               # Payment info
│   │
│   ├── routes/                      # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py                  # /api/auth/*
│   │   ├── projects.py              # /api/projects/*
│   │   ├── documents.py             # /api/projects/{id}/documents/*
│   │   ├── messages.py              # /api/projects/{id}/messages
│   │   ├── admin.py                 # /api/admin/*
│   │   └── files.py                 # /api/files/*
│   │
│   ├── services/                    # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py          # Authentication logic
│   │   ├── project_service.py       # Project CRUD
│   │   ├── document_service.py      # Document generation
│   │   ├── message_service.py       # Chat logic
│   │   ├── payment_service.py       # Payment tracking
│   │   └── file_service.py          # File upload/download
│   │
│   ├── generators/                  # Document generators
│   │   ├── __init__.py
│   │   ├── base.py                  # Base generator class
│   │   ├── pdf_generator.py         # HTML → PDF (WeasyPrint)
│   │   ├── txt_generator.py         # Plain text documents
│   │   ├── templates/               # HTML templates
│   │   │   ├── invoice.html
│   │   │   ├── certificate.html
│   │   │   ├── delivery_cert.html
│   │   │   └── ...
│   │   └── styles/                  # CSS for PDFs
│   │       └── document_styles.css
│   │
│   ├── utils/                       # Helper functions
│   │   ├── __init__.py
│   │   ├── formatters.py            # Date/time/currency formatters
│   │   ├── validators.py            # Input validation
│   │   ├── security.py              # Password hashing, JWT
│   │   └── constants.py             # Business constants
│   │
│   ├── database/                    # Database layer
│   │   ├── __init__.py
│   │   ├── connection.py            # MongoDB connection
│   │   └── collections.py           # Collection definitions
│   │
│   ├── middleware/                  # Custom middleware
│   │   ├── __init__.py
│   │   ├── auth_middleware.py       # JWT verification
│   │   ├── cors_middleware.py       # CORS config
│   │   └── logging_middleware.py    # Request logging
│   │
│   ├── tests/                       # Unit & integration tests
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   ├── test_projects.py
│   │   ├── test_documents.py
│   │   └── ...
│   │
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment template
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── index.js                 # React entry point
│   │   ├── App.js                   # Root component
│   │   │
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ui/                  # shadcn/ui components
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   └── ...
│   │   │   ├── Layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── Project/
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   ├── ProjectList.jsx
│   │   │   │   └── ProjectForm.jsx
│   │   │   ├── OperationalChain/
│   │   │   │   ├── ChainTimeline.jsx
│   │   │   │   ├── StageCard.jsx
│   │   │   │   └── DocumentCard.jsx
│   │   │   ├── Chat/
│   │   │   │   ├── ChatContainer.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   └── MessageInput.jsx
│   │   │   └── Documents/
│   │   │       ├── DocumentPreview.jsx
│   │   │       └── DocumentActions.jsx
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ClientDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ProjectDetails.jsx
│   │   │   ├── NewProject.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── context/                 # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── ProjectContext.js
│   │   │
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useProjects.js
│   │   │   └── useDocuments.js
│   │   │
│   │   ├── utils/                   # Helper functions
│   │   │   ├── api.js               # API client (axios/fetch)
│   │   │   ├── formatters.js        # Date/currency formatters
│   │   │   └── validators.js        # Form validation
│   │   │
│   │   ├── styles/                  # Global styles
│   │   │   └── globals.css
│   │   │
│   │   └── constants/               # Constants
│   │       ├── stages.js            # Operational chain stages
│   │       └── roles.js             # User roles
│   │
│   ├── package.json                 # npm dependencies
│   └── .env.example                 # Environment template
│
├── memory/                          # Documentation (Emergent)
│   ├── PRODUCTION_PRD.md            # This file's companion
│   ├── ARCHITECTURE.md              # This file
│   ├── MIGRATION_GUIDE.md           # Migration instructions
│   └── API_DOCUMENTATION.md         # API reference
│
├── .gitignore
├── README.md
└── docker-compose.yml               # Optional: for local dev
```

---

## 🔌 API Endpoints Structure

### Authentication (`/api/auth`)
```
POST   /api/auth/register      # Create new user account
POST   /api/auth/login         # Login (returns JWT)
POST   /api/auth/logout        # Logout (invalidate token)
GET    /api/auth/me            # Get current user info
POST   /api/auth/refresh       # Refresh JWT token
```

### Projects (`/api/projects`)
```
GET    /api/projects                      # List user's projects
POST   /api/projects                      # Create new project
GET    /api/projects/{id}                 # Get project details
PATCH  /api/projects/{id}                 # Update project
DELETE /api/projects/{id}                 # Archive project (soft delete)
GET    /api/projects/{id}/timeline        # Get operational chain
PATCH  /api/projects/{id}/status          # Update project status
```

### Documents (`/api/projects/{id}/documents`)
```
GET    /api/projects/{id}/documents                    # List all docs
GET    /api/projects/{id}/documents/{type}/pdf         # Download PDF
GET    /api/projects/{id}/documents/{type}/generate    # Generate TXT preview
POST   /api/projects/{id}/documents/{type}/sign        # Sign document
```

### Messages (`/api/projects/{id}/messages`)
```
GET    /api/projects/{id}/messages        # Get chat history
POST   /api/projects/{id}/messages        # Send message
```

### Files (`/api/files`)
```
POST   /api/files/upload                  # Upload file (script, etc.)
GET    /api/files/{id}                    # Download file
DELETE /api/files/{id}                    # Delete file
```

### Admin (`/api/admin`)
```
GET    /api/admin/users                   # List all users
POST   /api/admin/users                   # Create user account
GET    /api/admin/projects                # List all projects
POST   /api/admin/projects                # Create project for client
PATCH  /api/admin/projects/{id}/payment   # Confirm payment
```

---

## 🗄️ Database Schema (MongoDB)

### Users Collection
```javascript
{
  _id: ObjectId,
  id: "uuid-string",                    // Custom UUID
  email: "client@example.com",
  password_hash: "bcrypt-hash",
  name: "John Doe",
  role: "client" | "admin",
  created_at: ISODate,
  last_login: ISODate,
  is_active: true
}
```

### Projects Collection
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  project_number: "VAPP-7-Premium2000USD-15Apr2026",
  
  // Client info
  user_id: "uuid-string",
  user_name: "John Doe",
  user_email: "client@example.com",
  
  // Project details
  service_type: "custom_video",
  project_title: "Corporate Training Video",
  brief: "Description...",
  quote_amount: 1500,
  
  // Operational chain timestamps
  created_at: ISODate,
  order_activated_at: ISODate | null,
  quote_sent_at: ISODate | null,
  quote_accepted_at: ISODate | null,
  invoice_signed_at: ISODate | null,
  production_started_at: ISODate | null,
  delivered_at: ISODate | null,
  files_accessed_at: ISODate | null,
  delivery_confirmed_at: ISODate | null,
  work_accepted_at: ISODate | null,
  payment_marked_by_client_at: ISODate | null,
  payment_confirmed_by_manager_at: ISODate | null,
  completed_at: ISODate | null,
  
  // Current status
  status: "submitted" | "order_activated" | ... | "completed",
  
  // Documents
  document_numbers: {
    invoice: "VAPP7-INV-0001-260415",
    certificate: "VAPP7-CRT-0001-260430",
    // ...
  },
  document_names: {
    invoice: "Invoice_VAPP7_1500USD.pdf",
    // ...
  },
  
  // Materials
  uploaded_materials: ["script.pdf", "refs.zip"],
  deliverables: [
    {
      file_name: "Final_Video.mp4",
      file_size: "2.1GB",
      is_final: true,
      uploaded_at: ISODate
    }
  ],
  
  // Payment
  paypal_transaction_id: "ABC123XYZ",
  payment_confirmed_by_admin: true,
  
  // Notes
  production_notes: "Text notes...",
  quote_request_manager_comments: "Text...",
  
  // Metadata
  acceptance_status: "approved" | "pending" | "rejected"
}
```

### Messages Collection
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  project_id: "uuid-string",
  sender_id: "uuid-string" | "admin",
  sender_name: "John Doe",
  sender_role: "client" | "admin",
  message: "Text content...",
  created_at: ISODate,
  attachments: []  // Always empty (no files in chat)
}
```

### Files Collection (Optional - if using DB for file metadata)
```javascript
{
  _id: ObjectId,
  id: "uuid-string",
  project_id: "uuid-string",
  file_name: "script_v2.pdf",
  file_path: "/uploads/projects/{id}/script_v2.pdf",
  file_size: 1024567,
  mime_type: "application/pdf",
  uploaded_by: "uuid-string",
  uploaded_at: ISODate,
  category: "script" | "reference" | "deliverable" | "payment_proof"
}
```

---

## 🔐 Security Architecture

### Authentication Flow
```
1. Client submits email + password
   ↓
2. Backend verifies credentials
   ↓
3. Backend generates JWT (expires in 24h)
   ↓
4. Frontend stores JWT in localStorage
   ↓
5. All API calls include: Authorization: Bearer {JWT}
   ↓
6. Backend validates JWT on each request
```

### Role-Based Access Control (RBAC)
```
Client Role:
  ✅ CAN: View own projects, upload files, send messages
  ❌ CANNOT: View other clients, change status, confirm payment

Admin Role:
  ✅ CAN: Everything (full access)
  ❌ CANNOT: Delete completed projects (audit trail)
```

---

## 📦 Component Dependencies

### Backend Key Libraries
```
fastapi==0.110.0
uvicorn==0.27.0
motor==3.3.2              # Async MongoDB
pydantic==2.6.0
python-jose[cryptography] # JWT
passlib[bcrypt]           # Password hashing
weasyprint==60.2          # PDF generation
python-multipart          # File uploads
```

### Frontend Key Libraries
```
react@18.2.0
react-router-dom@6.22.0
axios@1.6.7
tailwindcss@3.4.1
shadcn/ui components
lucide-react (icons)
```

---

## 🚀 Deployment Architecture (Future)

```
┌─────────────┐
│   Vercel    │  ← Frontend (React SPA)
└─────────────┘
       ↓ API calls
┌─────────────┐
│   Railway   │  ← Backend (FastAPI)
└─────────────┘
       ↓
┌─────────────┐
│ MongoDB     │  ← Database (MongoDB Atlas)
│  Atlas      │
└─────────────┘
       ↓
┌─────────────┐
│   AWS S3    │  ← File Storage (Optional)
└─────────────┘
```

---

## 📊 Data Flow Example: Create Project

```
1. Client fills project form
   ↓
2. Frontend validates input
   ↓
3. POST /api/projects {title, brief, ...}
   ↓
4. Backend validates request (Pydantic)
   ↓
5. Backend creates Project in MongoDB
   ↓
6. Backend returns project object
   ↓
7. Frontend redirects to /project/{id}
   ↓
8. Frontend loads Operational Chain
   ↓
9. Stage 1 (Submitted) shows as ✓ completed
```

---

## 🎨 State Management

### Frontend State Architecture
```
Global State (React Context):
├── AuthContext
│   ├── user (current user object)
│   ├── isAuthenticated (boolean)
│   ├── login(email, password)
│   └── logout()
│
└── ProjectContext (Optional)
    ├── currentProject
    ├── projects[]
    └── refreshProjects()

Component State (useState):
├── Form inputs
├── Loading states
└── UI toggles

Server State (React Query - Optional):
├── useProjects()
├── useProject(id)
└── useMessages(projectId)
```

---

**This architecture provides a solid foundation for a scalable, maintainable production system.**
