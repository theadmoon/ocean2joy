from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('JWT_SECRET', 'ocean2joy-secret-key-change-in-production')

# Create the main app
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

# User Models
class UserRole(str):
    CLIENT = "client"
    MANAGER = "manager"
    ADMIN = "admin"

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: str = UserRole.CLIENT
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    created_by: Optional[str] = None  # manager/admin who created this user
    is_active: bool = True

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = UserRole.CLIENT

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: User

# Service Models
class ServiceType(str):
    CUSTOM_VIDEO = "custom_video"
    VIDEO_EDITING = "video_editing"
    AI_VIDEO = "ai_video"

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str
    title: str
    description: str
    deliverable_type: str
    output_format: List[str]
    pricing_model: str  # "per_minute" or "per_project" or "custom"
    base_price: float
    price_description: str
    revision_policy: str
    turnaround_time: str
    features: List[str]
    genres: Optional[List[str]] = []
    image_url: Optional[str] = None

# Request/Intake Models
class QuickRequest(BaseModel):
    name: str
    email: EmailStr
    service_type: str
    phone: Optional[str] = None
    brief_description: str
    deadline: Optional[str] = None

class QuickRequestResponse(BaseModel):
    request_id: str
    message: str
    email: str
    next_steps: str

class DetailedRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    service_type: str
    project_title: str
    detailed_brief: str
    objectives: str
    reference_materials: Optional[List[str]] = []  # file URLs
    special_instructions: Optional[str] = None
    expected_duration: Optional[str] = None
    deadline_preference: Optional[str] = None
    budget_range: Optional[str] = None
    status: str = "submitted"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DetailedRequestCreate(BaseModel):
    service_type: str
    project_title: str
    detailed_brief: str
    objectives: str
    special_instructions: Optional[str] = None
    expected_duration: Optional[str] = None
    deadline_preference: Optional[str] = None
    budget_range: Optional[str] = None

# Project Models
class ProjectStatus(str):
    SUBMITTED = "submitted"
    QUOTED = "quoted"
    QUOTE_ACCEPTED = "quote_accepted"
    IN_PRODUCTION = "in_production"
    IN_REVIEW = "in_review"
    REVISION_REQUESTED = "revision_requested"
    DELIVERED = "delivered"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Project(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_number: str  # Human-readable like "OCN-2025-001"
    user_id: str
    user_name: str
    user_email: str
    service_type: str
    project_title: str
    detailed_brief: str
    objectives: str
    reference_materials: List[str] = []
    special_instructions: Optional[str] = None
    expected_duration: Optional[str] = None
    deadline_preference: Optional[str] = None
    budget_range: Optional[str] = None
    
    # Transaction framing
    quote_amount: Optional[float] = None
    quote_details: Optional[str] = None
    quote_sent_at: Optional[datetime] = None
    quote_accepted_at: Optional[datetime] = None
    
    # Fulfillment
    production_started_at: Optional[datetime] = None
    production_notes: Optional[str] = None
    revision_count: int = 0
    
    # Delivery
    delivered_at: Optional[datetime] = None
    delivery_method: Optional[str] = "portal"  # portal, email, both
    deliverable_files: List[str] = []
    
    # Completion
    completed_at: Optional[datetime] = None
    acceptance_status: Optional[str] = None  # approved, revision_requested
    client_feedback: Optional[str] = None
    
    # PayPal Transaction Data (for real transaction tracking)
    paypal_transaction_id: Optional[str] = None
    paypal_payer_email: Optional[str] = None
    paypal_payment_status: Optional[str] = None  # COMPLETED, PENDING, REFUNDED
    
    # Status tracking
    status: str = ProjectStatus.SUBMITTED
    status_history: List[Dict[str, Any]] = []
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProjectUpdate(BaseModel):
    status: Optional[str] = None
    quote_amount: Optional[float] = None
    quote_details: Optional[str] = None
    production_notes: Optional[str] = None
    acceptance_status: Optional[str] = None
    client_feedback: Optional[str] = None
    
    # Date fields (for admin to manually set)
    created_at: Optional[str] = None
    quote_sent_at: Optional[str] = None
    quote_accepted_at: Optional[str] = None
    production_started_at: Optional[str] = None
    delivered_at: Optional[str] = None
    completed_at: Optional[str] = None
    
    # PayPal transaction data
    paypal_transaction_id: Optional[str] = None
    paypal_payer_email: Optional[str] = None
    paypal_payment_status: Optional[str] = None

# Message Models
class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    sender_id: str
    sender_name: str
    sender_role: str
    message: str
    attachments: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_read: bool = False

class MessageCreate(BaseModel):
    message: str
    attachments: List[str] = []

# Deliverable Models
class Deliverable(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: str
    file_name: str
    file_url: str
    file_type: str
    file_size: Optional[int] = None
    description: Optional[str] = None
    uploaded_by: str
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_final: bool = False

# Policy Models
class Policy(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: str  # terms, digital_delivery, refund, revision, privacy
    title: str
    content: str
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Contact Models
class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_handled: bool = False

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str

# Demo Video Models
class DemoVideo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    position: int  # 1 or 2
    title: str
    description: str
    tags: List[str] = []
    video_type: str = "file"  # "file" or "url"
    video_filename: Optional[str] = None  # For uploaded files
    video_url: str  # server path to video file OR external URL
    thumbnail_url: Optional[str] = None
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DemoVideoCreate(BaseModel):
    position: int
    title: str
    description: str
    tags: List[str] = []

class DemoVideoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    is_active: Optional[bool] = None
    thumbnail_url: Optional[str] = None

# ==================== HELPER FUNCTIONS ====================

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = await db.users.find_one({"id": payload.get("user_id")}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return User(**user)

def generate_project_number():
    """Generate unique project number like OCN-2025-001"""
    now = datetime.now(timezone.utc)
    year = now.year
    random_suffix = str(uuid.uuid4())[:8].upper()
    return f"OCN-{year}-{random_suffix}"

# ==================== PUBLIC ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Ocean2joy API - Where Video Dreams Come True"}

@api_router.get("/services", response_model=List[Service])
async def get_services():
    """Get all available services"""
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    return services

@api_router.get("/services/{service_id}", response_model=Service)
async def get_service(service_id: str):
    """Get service details"""
    service = await db.services.find_one({"id": service_id}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@api_router.post("/quick-request", response_model=QuickRequestResponse)
async def create_quick_request(request: QuickRequest):
    """Quick request form - no registration needed"""
    # Check if user exists
    existing_user = await db.users.find_one({"email": request.email}, {"_id": 0})
    
    if not existing_user:
        # Create a minimal user account
        temp_password = str(uuid.uuid4())[:8]
        hashed_password = pwd_context.hash(temp_password)
        
        new_user = User(
            email=request.email,
            name=request.name,
            role=UserRole.CLIENT
        )
        user_doc = new_user.model_dump()
        user_doc['hashed_password'] = hashed_password
        user_doc['created_at'] = user_doc['created_at'].isoformat()
        await db.users.insert_one(user_doc)
        user_id = new_user.id
    else:
        user_id = existing_user['id']
    
    # Create project from quick request
    project = Project(
        project_number=generate_project_number(),
        user_id=user_id,
        user_name=request.name,
        user_email=request.email,
        service_type=request.service_type,
        project_title=f"Quick Request - {request.service_type}",
        detailed_brief=request.brief_description,
        objectives=request.brief_description,
        deadline_preference=request.deadline,
        status=ProjectStatus.SUBMITTED
    )
    
    project_doc = project.model_dump()
    project_doc['created_at'] = project_doc['created_at'].isoformat()
    project_doc['updated_at'] = project_doc['updated_at'].isoformat()
    await db.projects.insert_one(project_doc)
    
    return QuickRequestResponse(
        request_id=project.id,
        message="Your request has been received!",
        email=request.email,
        next_steps="Our team will review your request and send you a quote within 24 hours. Check your email for updates."
    )

@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(contact: ContactMessageCreate):
    """Contact form"""
    message = ContactMessage(**contact.model_dump())
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return message

@api_router.get("/policies", response_model=List[Policy])
async def get_policies():
    """Get all policies"""
    policies = await db.policies.find({}, {"_id": 0}).to_list(100)
    return policies

@api_router.get("/policies/{policy_type}", response_model=Policy)
async def get_policy(policy_type: str):
    """Get specific policy"""
    policy = await db.policies.find_one({"type": policy_type}, {"_id": 0})
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    """Full registration"""
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_password = pwd_context.hash(user_data.password)
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role
    )
    
    user_doc = new_user.model_dump()
    user_doc['hashed_password'] = hashed_password
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    await db.users.insert_one(user_doc)
    
    # Create token
    token = create_access_token({"user_id": new_user.id, "email": new_user.email})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=new_user
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login"""
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not pwd_context.verify(credentials.password, user_doc['hashed_password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Convert datetime strings back to datetime objects
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**{k: v for k, v in user_doc.items() if k != 'hashed_password'})
    token = create_access_token({"user_id": user.id, "email": user.email})
    
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user
    )

# ==================== PROTECTED CLIENT ROUTES ====================

@api_router.post("/requests", response_model=DetailedRequest)
async def create_detailed_request(
    request: DetailedRequestCreate,
    current_user: User = Depends(get_current_user)
):
    """Create detailed request (authenticated)"""
    detailed_req = DetailedRequest(
        user_id=current_user.id,
        **request.model_dump()
    )
    
    # Also create a project from this request
    project = Project(
        project_number=generate_project_number(),
        user_id=current_user.id,
        user_name=current_user.name,
        user_email=current_user.email,
        **request.model_dump(),
        status=ProjectStatus.SUBMITTED
    )
    
    # Save request
    req_doc = detailed_req.model_dump()
    req_doc['created_at'] = req_doc['created_at'].isoformat()
    await db.requests.insert_one(req_doc)
    
    # Save project
    project_doc = project.model_dump()
    project_doc['created_at'] = project_doc['created_at'].isoformat()
    project_doc['updated_at'] = project_doc['updated_at'].isoformat()
    await db.projects.insert_one(project_doc)
    
    return detailed_req

@api_router.get("/projects", response_model=List[Project])
async def get_my_projects(current_user: User = Depends(get_current_user)):
    """Get user's projects"""
    projects = await db.projects.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    
    # Convert datetime strings back
    for proj in projects:
        for field in ['created_at', 'updated_at', 'quote_sent_at', 'quote_accepted_at', 
                      'production_started_at', 'delivered_at', 'completed_at']:
            if field in proj and isinstance(proj[field], str):
                proj[field] = datetime.fromisoformat(proj[field])
    
    return projects

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project_details(project_id: str, current_user: User = Depends(get_current_user)):
    """Get project details"""
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Authorization check
    if current_user.role == UserRole.CLIENT and project['user_id'] != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Convert datetime strings back
    for field in ['created_at', 'updated_at', 'quote_sent_at', 'quote_accepted_at', 
                  'production_started_at', 'delivered_at', 'completed_at']:
        if field in project and isinstance(project[field], str):
            project[field] = datetime.fromisoformat(project[field])
    
    return project

@api_router.patch("/projects/{project_id}/accept-quote")
async def accept_quote(project_id: str, current_user: User = Depends(get_current_user)):
    """Client accepts quote"""
    project = await db.projects.find_one({"id": project_id})
    if not project or project['user_id'] != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project['status'] != ProjectStatus.QUOTED:
        raise HTTPException(status_code=400, detail="Project must be in quoted status")
    
    update_data = {
        "status": ProjectStatus.QUOTE_ACCEPTED,
        "quote_accepted_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.projects.update_one({"id": project_id}, {"$set": update_data})
    return {"message": "Quote accepted", "status": ProjectStatus.QUOTE_ACCEPTED}

@api_router.patch("/projects/{project_id}/request-revision")
async def request_revision(
    project_id: str, 
    feedback: str = Form(...),
    current_user: User = Depends(get_current_user)
):
    """Client requests revision"""
    project = await db.projects.find_one({"id": project_id})
    if not project or project['user_id'] != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = {
        "status": ProjectStatus.REVISION_REQUESTED,
        "acceptance_status": "revision_requested",
        "client_feedback": feedback,
        "revision_count": project.get('revision_count', 0) + 1,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.projects.update_one({"id": project_id}, {"$set": update_data})
    return {"message": "Revision requested", "status": ProjectStatus.REVISION_REQUESTED}

@api_router.patch("/projects/{project_id}/approve")
async def approve_project(project_id: str, current_user: User = Depends(get_current_user)):
    """Client approves final deliverables"""
    project = await db.projects.find_one({"id": project_id})
    if not project or project['user_id'] != current_user.id:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = {
        "status": ProjectStatus.COMPLETED,
        "acceptance_status": "approved",
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.projects.update_one({"id": project_id}, {"$set": update_data})
    return {"message": "Project completed", "status": ProjectStatus.COMPLETED}

@api_router.get("/projects/{project_id}/messages", response_model=List[Message])
async def get_project_messages(project_id: str, current_user: User = Depends(get_current_user)):
    """Get project messages"""
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role == UserRole.CLIENT and project['user_id'] != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    messages = await db.messages.find({"project_id": project_id}, {"_id": 0}).to_list(1000)
    
    # Convert datetime strings
    for msg in messages:
        if isinstance(msg.get('created_at'), str):
            msg['created_at'] = datetime.fromisoformat(msg['created_at'])
    
    return messages

@api_router.post("/projects/{project_id}/messages", response_model=Message)
async def send_message(
    project_id: str,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user)
):
    """Send message in project"""
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role == UserRole.CLIENT and project['user_id'] != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    message = Message(
        project_id=project_id,
        sender_id=current_user.id,
        sender_name=current_user.name,
        sender_role=current_user.role,
        message=message_data.message,
        attachments=message_data.attachments
    )
    
    doc = message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.messages.insert_one(doc)
    
    return message

@api_router.get("/projects/{project_id}/deliverables", response_model=List[Deliverable])
async def get_project_deliverables(project_id: str, current_user: User = Depends(get_current_user)):
    """Get project deliverables"""
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if current_user.role == UserRole.CLIENT and project['user_id'] != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    deliverables = await db.deliverables.find({"project_id": project_id}, {"_id": 0}).to_list(1000)
    
    # Convert datetime strings
    for deliv in deliverables:
        if isinstance(deliv.get('uploaded_at'), str):
            deliv['uploaded_at'] = datetime.fromisoformat(deliv['uploaded_at'])
    
    return deliverables

# ==================== MANAGER/ADMIN ROUTES ====================

@api_router.post("/admin/users", response_model=User)
async def create_user_by_manager(
    user_data: UserCreate,
    current_user: User = Depends(get_current_user)
):
    """Manager creates user account"""
    if current_user.role not in [UserRole.MANAGER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user with auto-generated password
    temp_password = str(uuid.uuid4())[:10]
    hashed_password = pwd_context.hash(temp_password)
    
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role,
        created_by=current_user.id
    )
    
    user_doc = new_user.model_dump()
    user_doc['hashed_password'] = hashed_password
    user_doc['temp_password'] = temp_password  # Store temporarily for manager to send
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    await db.users.insert_one(user_doc)
    
    return new_user

@api_router.get("/admin/projects", response_model=List[Project])
async def get_all_projects(current_user: User = Depends(get_current_user)):
    """Manager/Admin gets all projects"""
    if current_user.role not in [UserRole.MANAGER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    projects = await db.projects.find({}, {"_id": 0}).to_list(1000)
    
    # Convert datetime strings
    for proj in projects:
        for field in ['created_at', 'updated_at', 'quote_sent_at', 'quote_accepted_at', 
                      'production_started_at', 'delivered_at', 'completed_at']:
            if field in proj and isinstance(proj[field], str):
                proj[field] = datetime.fromisoformat(proj[field])
    
    return projects

@api_router.patch("/admin/projects/{project_id}", response_model=Project)
async def update_project_by_manager(
    project_id: str,
    update_data: ProjectUpdate,
    current_user: User = Depends(get_current_user)
):
    """Manager updates project"""
    if current_user.role not in [UserRole.MANAGER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    # Handle status changes with timestamps
    if 'status' in update_dict:
        if update_dict['status'] == ProjectStatus.QUOTED and 'quote_amount' in update_dict:
            update_dict['quote_sent_at'] = datetime.now(timezone.utc).isoformat()
        elif update_dict['status'] == ProjectStatus.IN_PRODUCTION:
            update_dict['production_started_at'] = datetime.now(timezone.utc).isoformat()
        elif update_dict['status'] == ProjectStatus.DELIVERED:
            update_dict['delivered_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.projects.update_one({"id": project_id}, {"$set": update_dict})
    
    # Get updated project
    updated_project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    
    # Convert datetime strings
    for field in ['created_at', 'updated_at', 'quote_sent_at', 'quote_accepted_at', 
                  'production_started_at', 'delivered_at', 'completed_at']:
        if field in updated_project and isinstance(updated_project[field], str):
            updated_project[field] = datetime.fromisoformat(updated_project[field])
    
    return updated_project

@api_router.post("/admin/projects/{project_id}/deliverables")
async def upload_deliverable(
    project_id: str,
    file_name: str = Form(...),
    file_url: str = Form(...),
    file_type: str = Form(...),
    description: str = Form(None),
    is_final: bool = Form(False),
    current_user: User = Depends(get_current_user)
):
    """Manager uploads deliverable"""
    if current_user.role not in [UserRole.MANAGER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    deliverable = Deliverable(
        project_id=project_id,
        file_name=file_name,
        file_url=file_url,
        file_type=file_type,
        description=description,
        uploaded_by=current_user.id,
        is_final=is_final
    )
    
    doc = deliverable.model_dump()
    doc['uploaded_at'] = doc['uploaded_at'].isoformat()
    await db.deliverables.insert_one(doc)
    
    # Update project deliverable_files list
    await db.projects.update_one(
        {"id": project_id},
        {"$push": {"deliverable_files": file_url}}
    )
    
    return {"message": "Deliverable uploaded", "deliverable": deliverable}

# ==================== DEMO VIDEOS ENDPOINTS ====================

@api_router.get("/demo-videos", response_model=List[DemoVideo])
async def get_demo_videos():
    """Get all demo videos (public endpoint)"""
    videos = await db.demo_videos.find({"is_active": True}, {"_id": 0}).sort("position", 1).to_list(10)
    return videos

@api_router.get("/admin/demo-videos", response_model=List[DemoVideo])
async def admin_get_all_demo_videos(current_user: User = Depends(get_current_user)):
    """Get all demo videos for admin (including inactive)"""
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    videos = await db.demo_videos.find({}, {"_id": 0}).sort("position", 1).to_list(10)
    return videos

@api_router.post("/admin/demo-videos/upload")
async def upload_demo_video(
    position: int = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    tags: str = Form(""),  # comma-separated
    thumbnail_url: str = Form(""),  # optional preview image URL
    video: UploadFile = File(...),
    thumbnail: UploadFile = File(None),  # optional preview image file
    current_user: User = Depends(get_current_user)
):
    """Upload a new demo video"""
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Validate position
    if position not in [1, 2]:
        raise HTTPException(status_code=400, detail="Position must be 1 or 2")
    
    # Validate file type
    allowed_types = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"]
    if video.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Invalid file type. Only MP4, WebM, MOV, AVI are allowed")
    
    # Generate unique filename
    file_extension = video.filename.split('.')[-1]
    unique_filename = f"{str(uuid.uuid4())}.{file_extension}"
    file_path = Path("/app/backend/uploads/demo-videos") / unique_filename
    
    # Save video file
    try:
        with open(file_path, "wb") as f:
            content = await video.read()
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save video: {str(e)}")
    
    # Handle thumbnail
    final_thumbnail_url = thumbnail_url if thumbnail_url else None
    
    if thumbnail:
        # Validate thumbnail file type
        allowed_thumb_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if thumbnail.content_type not in allowed_thumb_types:
            raise HTTPException(status_code=400, detail="Invalid thumbnail type. Only JPG, PNG, WebP allowed")
        
        # Save thumbnail file
        thumb_extension = thumbnail.filename.split('.')[-1]
        thumb_unique_filename = f"{str(uuid.uuid4())}.{thumb_extension}"
        thumb_file_path = Path("/app/backend/uploads/thumbnails") / thumb_unique_filename
        
        try:
            with open(thumb_file_path, "wb") as f:
                thumb_content = await thumbnail.read()
                f.write(thumb_content)
            
            final_thumbnail_url = f"/uploads/thumbnails/{thumb_unique_filename}"
        except Exception as e:
            logger.error(f"Failed to save thumbnail: {e}")
    
    # Parse tags
    tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
    
    # Check if video already exists for this position and deactivate it
    existing_video = await db.demo_videos.find_one({"position": position, "is_active": True}, {"_id": 0})
    if existing_video:
        await db.demo_videos.update_one(
            {"id": existing_video["id"]},
            {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc)}}
        )
    
    # Create demo video record
    demo_video = DemoVideo(
        position=position,
        title=title,
        description=description,
        tags=tags_list,
        video_type="file",
        video_filename=unique_filename,
        video_url=f"/uploads/demo-videos/{unique_filename}",
        thumbnail_url=final_thumbnail_url
    )
    
    await db.demo_videos.insert_one(demo_video.model_dump())
    
    return demo_video

@api_router.post("/admin/demo-videos/upload-url")
async def upload_demo_video_url(
    position: int = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    tags: str = Form(""),
    video_url: str = Form(...),
    thumbnail_url: str = Form(""),  # optional preview image URL
    thumbnail: UploadFile = File(None),  # optional preview image file
    current_user: User = Depends(get_current_user)
):
    """Add a demo video from external URL (Yandex Disk, Google Drive, direct link)"""
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Validate position
    if position not in [1, 2]:
        raise HTTPException(status_code=400, detail="Position must be 1 or 2")
    
    # Validate URL
    if not video_url or not video_url.startswith(('http://', 'https://')):
        raise HTTPException(status_code=400, detail="Invalid URL")
    
    # Parse tags
    tags_list = [tag.strip() for tag in tags.split(",") if tag.strip()]
    
    # Handle thumbnail
    final_thumbnail_url = thumbnail_url if thumbnail_url else None
    
    if thumbnail:
        # Validate thumbnail file type
        allowed_thumb_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if thumbnail.content_type not in allowed_thumb_types:
            raise HTTPException(status_code=400, detail="Invalid thumbnail type. Only JPG, PNG, WebP allowed")
        
        # Save thumbnail file
        thumb_extension = thumbnail.filename.split('.')[-1]
        thumb_unique_filename = f"{str(uuid.uuid4())}.{thumb_extension}"
        thumb_file_path = Path("/app/backend/uploads/thumbnails") / thumb_unique_filename
        
        try:
            with open(thumb_file_path, "wb") as f:
                thumb_content = await thumbnail.read()
                f.write(thumb_content)
            
            final_thumbnail_url = f"/uploads/thumbnails/{thumb_unique_filename}"
        except Exception as e:
            logger.error(f"Failed to save thumbnail: {e}")
    
    # Check if video already exists for this position and deactivate it
    existing_video = await db.demo_videos.find_one({"position": position, "is_active": True}, {"_id": 0})
    if existing_video:
        await db.demo_videos.update_one(
            {"id": existing_video["id"]},
            {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc)}}
        )
    
    # Create demo video record with URL
    demo_video = DemoVideo(
        position=position,
        title=title,
        description=description,
        tags=tags_list,
        video_type="url",
        video_filename=None,
        video_url=video_url,
        thumbnail_url=final_thumbnail_url
    )
    
    await db.demo_videos.insert_one(demo_video.model_dump())
    
    return demo_video

@api_router.patch("/admin/demo-videos/{video_id}", response_model=DemoVideo)
async def update_demo_video(
    video_id: str,
    update_data: DemoVideoUpdate,
    current_user: User = Depends(get_current_user)
):
    """Update demo video metadata"""
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    video = await db.demo_videos.find_one({"id": video_id}, {"_id": 0})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    await db.demo_videos.update_one(
        {"id": video_id},
        {"$set": update_dict}
    )
    
    updated_video = await db.demo_videos.find_one({"id": video_id}, {"_id": 0})
    return DemoVideo(**updated_video)

@api_router.post("/admin/demo-videos/{video_id}/upload-thumbnail")
async def upload_demo_video_thumbnail(
    video_id: str,
    thumbnail: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Upload thumbnail for existing video"""
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    video = await db.demo_videos.find_one({"id": video_id}, {"_id": 0})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Validate thumbnail file type
    allowed_thumb_types = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if thumbnail.content_type not in allowed_thumb_types:
        raise HTTPException(status_code=400, detail="Invalid thumbnail type. Only JPG, PNG, WebP allowed")
    
    # Save thumbnail file
    thumb_extension = thumbnail.filename.split('.')[-1]
    thumb_unique_filename = f"{str(uuid.uuid4())}.{thumb_extension}"
    thumb_file_path = Path("/app/backend/uploads/thumbnails") / thumb_unique_filename
    
    try:
        with open(thumb_file_path, "wb") as f:
            thumb_content = await thumbnail.read()
            f.write(thumb_content)
        
        thumbnail_url = f"/uploads/thumbnails/{thumb_unique_filename}"
        
        # Update video with new thumbnail
        await db.demo_videos.update_one(
            {"id": video_id},
            {"$set": {"thumbnail_url": thumbnail_url, "updated_at": datetime.now(timezone.utc)}}
        )
        
        return {"thumbnail_url": thumbnail_url, "message": "Thumbnail uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save thumbnail: {str(e)}")

@api_router.delete("/admin/demo-videos/{video_id}")
async def delete_demo_video(
    video_id: str,
    current_user: User = Depends(get_current_user)
):
    """Delete a demo video"""
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    video = await db.demo_videos.find_one({"id": video_id}, {"_id": 0})
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # Delete file from filesystem (only for uploaded files)
    try:
        if video.get("video_filename"):
            file_path = Path("/app/backend/uploads/demo-videos") / video["video_filename"]
            if file_path.exists():
                file_path.unlink()
        
        # Delete thumbnail if it's an uploaded file
        if video.get("thumbnail_url") and video["thumbnail_url"].startswith("/uploads/thumbnails/"):
            thumb_filename = video["thumbnail_url"].split("/")[-1]
            thumb_path = Path("/app/backend/uploads/thumbnails") / thumb_filename
            if thumb_path.exists():
                thumb_path.unlink()
    except Exception as e:
        logger.error(f"Failed to delete video file: {e}")
    
    # Delete from database
    await db.demo_videos.delete_one({"id": video_id})
    
    return {"message": "Video deleted successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files (videos and thumbnails) with proper CORS headers
from fastapi.responses import FileResponse
import mimetypes

@app.get("/uploads/{file_type}/{filename}")
async def serve_uploaded_file(file_type: str, filename: str):
    """Serve uploaded files with proper CORS headers"""
    if file_type not in ["demo-videos", "thumbnails"]:
        raise HTTPException(status_code=404, detail="Not found")
    
    file_path = Path(f"/app/backend/uploads/{file_type}") / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    # Get MIME type
    mime_type, _ = mimetypes.guess_type(str(file_path))
    if not mime_type:
        # Fallback MIME types
        ext = filename.split('.')[-1].lower()
        mime_map = {
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'mov': 'video/quicktime',
            'avi': 'video/x-msvideo',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'webp': 'image/webp'
        }
        mime_type = mime_map.get(ext, 'application/octet-stream')
    
    # Create response with proper headers
    response = FileResponse(
        path=str(file_path),
        media_type=mime_type,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Cross-Origin-Resource-Policy": "cross-origin",
            "Cross-Origin-Embedder-Policy": "unsafe-none",
            "Cache-Control": "public, max-age=3600",
            "X-Content-Type-Options": "nosniff"
        }
    )
    
    return response

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

# ==================== SEED DATA ON STARTUP ====================

@app.on_event("startup")
async def seed_initial_data():
    """Seed initial services and policies"""
    
    # Check if services exist
    existing_services = await db.services.count_documents({})
    if existing_services == 0:
        services_data = [
            {
                "id": str(uuid.uuid4()),
                "type": ServiceType.CUSTOM_VIDEO,
                "title": "Custom Video Production with Actors",
                "description": "Professional video production with real actors, custom scripts, and high-quality filming. Perfect for commercials, short films, educational content, and brand stories.",
                "deliverable_type": "Custom digital video files",
                "output_format": ["MP4", "MOV", "ProRes"],
                "pricing_model": "per_minute",
                "base_price": 25.0,
                "price_description": "$25-35 per minute, calculated based on duration and complexity",
                "revision_policy": "Up to 2 revisions included, additional revisions available",
                "turnaround_time": "2-4 weeks depending on project scope",
                "features": [
                    "Professional actors and crew",
                    "Custom script development",
                    "Location scouting and setup",
                    "Professional equipment and lighting",
                    "Post-production editing",
                    "Sound design and music",
                    "Color grading"
                ],
                "genres": ["Comedy", "Drama", "Fantasy", "Sports", "Educational", "Commercial", "Superhero"],
                "image_url": "https://images.unsplash.com/photo-1768483534260-1b440d8044e8"
            },
            {
                "id": str(uuid.uuid4()),
                "type": ServiceType.VIDEO_EDITING,
                "title": "Professional Video Editing & Special Effects",
                "description": "Expert video editing and post-production services for your existing footage. From basic cuts to advanced special effects and motion graphics.",
                "deliverable_type": "Edited digital video files",
                "output_format": ["MP4", "MOV", "AVI", "custom formats"],
                "pricing_model": "per_project",
                "base_price": 10.99,
                "price_description": "Starting at $10.99 per element, full project pricing calculated based on complexity",
                "revision_policy": "Up to 3 revision rounds included",
                "turnaround_time": "3-10 days depending on project complexity",
                "features": [
                    "Professional video editing",
                    "Advanced special effects (VFX)",
                    "Motion graphics and animations",
                    "Color correction and grading",
                    "Audio mixing and enhancement",
                    "Text and title design",
                    "Green screen compositing",
                    "3D elements integration"
                ],
                "genres": [],
                "image_url": "https://images.unsplash.com/photo-1764557175375-9e2bea91530e"
            },
            {
                "id": str(uuid.uuid4()),
                "type": ServiceType.AI_VIDEO,
                "title": "AI-Generated Video Content",
                "description": "Cutting-edge AI-powered video creation with digital characters and environments. Perfect for creative projects, explainer videos, and unique visual content.",
                "deliverable_type": "AI-generated digital video files",
                "output_format": ["MP4", "MOV", "GIF"],
                "pricing_model": "custom",
                "base_price": 20.0,
                "price_description": "Custom pricing based on video length, complexity, and AI features used",
                "revision_policy": "Up to 2 revisions included",
                "turnaround_time": "1-2 weeks depending on project scope",
                "features": [
                    "AI-generated characters",
                    "Synthetic voice-over",
                    "Automated scene generation",
                    "Style transfer and effects",
                    "Text-to-video conversion",
                    "Custom AI model training available",
                    "Fast turnaround time"
                ],
                "genres": ["Animation", "Explainer Videos", "Educational", "Marketing", "Social Media"],
                "image_url": "https://images.unsplash.com/photo-1764664282125-f9bbeedd9479"
            }
        ]
        
        await db.services.insert_many(services_data)
        logger.info("Services seeded successfully")
    
    # Check if policies exist
    existing_policies = await db.policies.count_documents({})
    if existing_policies == 0:
        policies_data = [
            {
                "id": str(uuid.uuid4()),
                "type": "terms",
                "title": "Terms of Service",
                "content": """
# Terms of Service - Ocean2joy.com

## Digital Service Model

Ocean2joy.com provides **custom digital video production services**. All deliverables are digital files created specifically for each client and delivered electronically.

## Service Types

1. **Custom Video Production**: Videos filmed with real actors based on your script
2. **Video Editing**: Professional editing of your existing footage
3. **AI-Generated Videos**: AI-powered video content creation

## How It Works

1. Submit your project request with detailed brief
2. Receive custom quote within 24 hours
3. Accept quote and provide any additional materials
4. Production begins after confirmation
5. Receive deliverables electronically via client portal
6. Request revisions if needed (within policy limits)
7. Approve final deliverables

## Delivery

All services are delivered **electronically** through:
- Secure client portal download
- Email delivery (for smaller files)
- Cloud storage links

**No physical shipment is involved**. All deliverables are digital files.

## Custom Work

Every project is custom-made based on your specific requirements. Production is performed in-house by our professional team.

## Accepted Content

We only produce content in publicly acceptable genres: comedy, drama, fantasy, sports, educational, commercial, superhero, etc. **Adult content is strictly prohibited**.
                """,
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "type": "digital_delivery",
                "title": "Digital Delivery Policy",
                "content": """
# Digital Delivery Policy

## Electronic Delivery Only

Ocean2joy.com operates as a **digital-first service**. All video deliverables are:

- Created digitally in-house
- Delivered electronically
- No physical media or shipment involved

## Delivery Methods

**Primary**: Secure client portal with download access
**Secondary**: Direct email (for files under 25MB)
**Alternative**: Secure cloud storage links (Google Drive, Dropbox, WeTransfer)

## File Formats

Standard formats include:
- MP4 (most common)
- MOV
- ProRes (for professional use)
- Custom formats upon request

## Delivery Timeline

- Files uploaded to portal within 24 hours of completion
- Email notification sent immediately
- Files remain accessible for 90 days
- Extended access available upon request

## File Ownership

Once delivered and payment confirmed, you receive full rights to the deliverables as agreed in project terms.
                """,
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "type": "refund",
                "title": "Refund & Cancellation Policy",
                "content": """
# Refund & Cancellation Policy

## Cancellation

**Before production starts**: Full refund minus 10% administrative fee
**During production**: Partial refund based on work completed
**After delivery**: No refunds, revisions available per revision policy

## Refund Process

Refunds processed within 7-10 business days to original payment method.

## Disputes

We aim to resolve all issues through revisions first. If you're not satisfied, contact us before requesting a refund.

## Custom Work Nature

Since all projects are custom-made specifically for you, we cannot resell or reuse content. This affects our refund policy.
                """,
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "type": "revision",
                "title": "Revision Policy",
                "content": """
# Revision Policy

## Included Revisions

- **Custom Video Production**: 2 revision rounds
- **Video Editing**: 3 revision rounds
- **AI-Generated Video**: 2 revision rounds

## What Counts as a Revision

A revision round includes reasonable changes to:
- Editing cuts and timing
- Color grading adjustments
- Audio mixing
- Text/graphics changes
- Minor scene adjustments

## What's NOT Included

- Complete re-shoots (quoted separately)
- Major script changes after filming
- Additional footage requests
- Scope expansion

## Revision Process

1. Review deliverables in your portal
2. Click "Request Revision"
3. Provide specific, detailed feedback
4. Receive revised version within 3-5 days
5. Approve or request additional changes (if rounds remain)

## Additional Revisions

Available at $49.99-$199.99 depending on complexity.
                """,
                "updated_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "type": "privacy",
                "title": "Privacy Policy",
                "content": """
# Privacy Policy

## Information We Collect

- Name, email, contact information
- Project briefs and materials you upload
- Communication history
- Payment information (processed securely)

## How We Use Information

- To fulfill your video production requests
- To communicate about your projects
- To improve our services
- For legal and compliance purposes

## Data Security

- All data encrypted in transit and at rest
- Secure cloud storage
- Limited access by authorized personnel only

## Your Rights

You can request:
- Access to your data
- Correction of inaccuracies
- Deletion of your account and data

## File Retention

- Active projects: Duration + 90 days
- Completed projects: 1 year unless extended
- You can download and backup anytime
                """,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        
        await db.policies.insert_many(policies_data)
        logger.info("Policies seeded successfully")
    
    # Create default admin user if not exists
    admin_exists = await db.users.find_one({"role": UserRole.ADMIN})
    if not admin_exists:
        admin_password = "admin123"  # Change this in production!
        hashed = pwd_context.hash(admin_password)
        
        admin_user = {
            "id": str(uuid.uuid4()),
            "email": "admin@ocean2joy.com",
            "name": "Admin User",
            "role": UserRole.ADMIN,
            "hashed_password": hashed,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "is_active": True
        }
        
        await db.users.insert_one(admin_user)
        logger.info("Admin user created: admin@ocean2joy.com / admin123")
    
    # Create test client user (Marcos Knight) if not exists
    test_client = await db.users.find_one({"email": "mek110@yahoo.com"})
    if not test_client:
        client_password = "marcos2026"
        hashed = pwd_context.hash(client_password)
        
        test_client_data = {
            "id": str(uuid.uuid4()),
            "email": "mek110@yahoo.com",
            "name": "Marcos Knight",
            "role": UserRole.CLIENT,
            "hashed_password": hashed,
            "created_at": datetime(2026, 2, 17, tzinfo=timezone.utc).isoformat(),
            "is_active": True
        }
        
        await db.users.insert_one(test_client_data)
        test_client = test_client_data
        logger.info("Test client created: mek110@yahoo.com / marcos2026")
    
    # Create test project for Marcos Knight if not exists
    test_project_exists = await db.projects.find_one({"project_number": "VAPP-6-Custom1050USD-13Mar2026"})
    
    if test_project_exists:
        project_id = test_project_exists["id"]
        logger.info(f"Test project already exists: {project_id}")
        
        # Check if we need to add PayPal Receipt message
        receipt_message_exists = await db.messages.find_one({
            "project_id": project_id,
            "attachments": "PayPal_Receipt_VAPP6_1050USD.pdf"
        })
        
        if not receipt_message_exists:
            # Find last message to determine correct timestamp
            last_message = await db.messages.find_one(
                {"project_id": project_id},
                sort=[("created_at", -1)]
            )
            
            # Add PayPal receipt message
            receipt_message = {
                "id": str(uuid.uuid4()),
                "project_id": project_id,
                "sender_id": test_client["id"],
                "sender_name": "Marcos Knight",
                "sender_role": "client",
                "message": "Payment completed via PayPal. Receipt attached for your records.",
                "created_at": datetime(2026, 3, 13, 10, 25, tzinfo=timezone.utc).isoformat(),
                "attachments": ["PayPal_Receipt_VAPP6_1050USD.pdf"]
            }
            
            await db.messages.insert_one(receipt_message)
            logger.info(f"Added PayPal Receipt message to project {project_id}")
    
    else:
        project_id = str(uuid.uuid4())
        
        test_project = {
            "id": project_id,
            "user_id": test_client["id"],
            "project_number": "VAPP-6-Custom1050USD-13Mar2026",
            "project_title": "Custom Film Production - Comedy Script",
            "service_type": "custom_video",
            "detailed_brief": "Customer film production according to client's script. Comedy genre video, 30 minutes duration with 2 professional actors and 2 special effects sequences. Client will provide detailed script via admin panel.",
            "objectives": "Create a professional comedy video based on client's custom script. High-quality production with professional actors, proper lighting, sound design, and post-production including 2 special effects.",
            "special_instructions": "Genre: Comedy | Duration: 30 minutes | Actors: 2 professional actors | Special Effects: 2 sequences | Script: Will be attached separately in admin panel",
            "status": "completed",
            "quote_amount": 1050,
            "quote_details": "30 minutes @ $35/minute. Includes professional actors, locations, crew, and 2 special effects sequences.",
            "payment_terms": "Payment due upon delivery",
            "created_at": datetime(2026, 2, 17, 8, 15, 33, tzinfo=timezone.utc).isoformat(),
            "quote_sent_at": datetime(2026, 2, 17, 14, 22, 17, tzinfo=timezone.utc).isoformat(),
            "quote_accepted_at": datetime(2026, 2, 18, 9, 45, 8, tzinfo=timezone.utc).isoformat(),
            "production_started_at": datetime(2026, 2, 19, 10, 0, 0, tzinfo=timezone.utc).isoformat(),
            "delivered_at": datetime(2026, 3, 11, 16, 30, 45, tzinfo=timezone.utc).isoformat(),
            "completed_at": datetime(2026, 3, 13, 11, 23, 12, tzinfo=timezone.utc).isoformat(),
            "acceptance_status": "approved",
            # Auto-fill PayPal data from client
            "paypal_payer_email": test_client["email"],
            "paypal_transaction_id": "8XJ72945RK156380M",
            "paypal_payment_status": "COMPLETED",
            "reference_materials": [
                "Comedy_Script_v1.pdf (uploaded by client)",
                "Character_References.zip (uploaded by client)",
                "Location_Photos.pdf (uploaded by client)"
            ]
        }
        
        await db.projects.insert_one(test_project)
        logger.info(f"Test project created: {project_id}")
        
        # Create test messages for the project
        messages_data = [
            {
                "id": str(uuid.uuid4()),
                "project_id": project_id,
                "sender_id": test_client["id"],
                "sender_name": "Marcos Knight",
                "sender_role": "client",
                "message": "Here is my request: I need a 30-minute comedy video produced according to my custom script. I'll need 2 professional actors and 2 special effects sequences. The script will be provided once we agree on terms. Can you give me a quote?",
                "created_at": datetime(2026, 2, 15, 2, 0, tzinfo=timezone.utc).isoformat(),
                "attachments": []
            },
            {
                "id": str(uuid.uuid4()),
                "project_id": project_id,
                "sender_id": "admin",
                "sender_name": "Ocean2joy Team",
                "sender_role": "admin",
                "message": "Hello Marcos,\n\nI am sorry for a late reply. A 30 minute video like this will cost 1050USD.\n\nIf you are ready to proceed, please press Create Order button on our website and I will make your invoices",
                "created_at": datetime(2026, 2, 16, 2, 0, tzinfo=timezone.utc).isoformat(),
                "attachments": []
            },
            {
                "id": str(uuid.uuid4()),
                "project_id": project_id,
                "sender_id": test_client["id"],
                "sender_name": "Marcos Knight",
                "sender_role": "client",
                "message": "Perfect! I've submitted the official order through your website. Ready to move forward with the $1,050 quote for the 30-minute comedy video. Script and reference materials attached.",
                "created_at": datetime(2026, 2, 17, 10, 15, tzinfo=timezone.utc).isoformat(),
                "attachments": ["Comedy_Script_v1.pdf", "Character_References.zip", "Location_Photos.pdf"]
            },
            {
                "id": str(uuid.uuid4()),
                "project_id": project_id,
                "sender_id": "admin",
                "sender_name": "Ocean2joy Team",
                "sender_role": "admin",
                "message": "Thank you! Production completed successfully. All deliverables are now available for download in your project portal. Invoice attached for your records.",
                "created_at": datetime(2026, 3, 11, 14, 30, tzinfo=timezone.utc).isoformat(),
                "attachments": ["invoice_VAPP6_1050USD.pdf"]
            },
            {
                "id": str(uuid.uuid4()),
                "project_id": project_id,
                "sender_id": test_client["id"],
                "sender_name": "Marcos Knight",
                "sender_role": "client",
                "message": "Payment completed via PayPal. Receipt attached for verification. Thank you for the excellent work!",
                "created_at": datetime(2026, 3, 13, 10, 23, tzinfo=timezone.utc).isoformat(),
                "attachments": ["PayPal_Receipt_VAPP6_1050USD.pdf", "completion_certificate.pdf"]
            }
        ]
        
        await db.messages.insert_many(messages_data)
        logger.info(f"Test messages created for project {project_id}")

