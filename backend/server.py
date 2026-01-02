from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import base64
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'accio-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION = timedelta(days=7)

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    role: str = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    role: str
    points: int = 0
    badges: List[str] = []
    created_at: str

class LostItemCreate(BaseModel):
    item_name: str
    location: str
    date_time: str
    description: str
    photo: Optional[str] = None

class FoundItemCreate(BaseModel):
    item_name: str
    category: str
    location: str
    date_time: str
    photo: str
    kept_with: str

class LostItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_email: str
    item_name: str
    location: str
    date_time: str
    description: str
    photo: Optional[str] = None
    status: str
    created_at: str

class FoundItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_email: str
    item_name: str
    category: str
    location: str
    date_time: str
    photo: str
    kept_with: str
    status: str
    created_at: str

class MessageCreate(BaseModel):
    receiver_id: str
    content: str

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    sender_id: str
    sender_email: str
    receiver_id: str
    receiver_email: str
    content: str
    timestamp: str
    read: bool

class Match(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    lost_item: LostItem
    found_item: FoundItem
    similarity_score: float

# Auth helpers
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        'user_id': user_id,
        'email': email,
        'role': role,
        'exp': datetime.now(timezone.utc) + JWT_EXPIRATION
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    user = await db.users.find_one({'id': payload['user_id']}, {'_id': 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

# AI Image Similarity
async def analyze_image_similarity(image1_base64: str, image2_base64: str) -> float:
    try:
        api_key = os.getenv("EMERGENT_LLM_KEY")
        chat = LlmChat(api_key=api_key, session_id=str(uuid.uuid4()), system_message="You are an image comparison expert.")
        chat.with_model("gemini", "gemini-3-pro-image-preview")
        
        msg = UserMessage(
            text="Compare these two images and rate their similarity from 0 to 100, where 100 means identical items. Respond with ONLY a number between 0-100.",
            file_contents=[ImageContent(image1_base64), ImageContent(image2_base64)]
        )
        
        response = await chat.send_message(msg)
        similarity = float(response.strip())
        return min(max(similarity, 0), 100)
    except Exception as e:
        logging.error(f"Error in image similarity: {e}")
        return 0

# Auth routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing = await db.users.find_one({'email': user_data.email}, {'_id': 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        'id': user_id,
        'email': user_data.email,
        'password_hash': hash_password(user_data.password),
        'role': user_data.role,
        'points': 0,
        'badges': [],
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_doc)
    token = create_token(user_id, user_data.email, user_data.role)
    
    return {
        'token': token,
        'user': {
            'id': user_id,
            'email': user_data.email,
            'role': user_data.role,
            'points': 0,
            'badges': []
        }
    }

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({'email': credentials.email}, {'_id': 0})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'], user['email'], user['role'])
    return {
        'token': token,
        'user': {
            'id': user['id'],
            'email': user['email'],
            'role': user['role'],
            'points': user.get('points', 0),
            'badges': user.get('badges', [])
        }
    }

# Lost Items
@api_router.post("/lost/create")
async def create_lost_item(item: LostItemCreate, current_user: User = Depends(get_current_user)):
    item_id = str(uuid.uuid4())
    item_doc = {
        'id': item_id,
        'user_id': current_user.id,
        'user_email': current_user.email,
        **item.model_dump(),
        'status': 'active',
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.lost_items.insert_one(item_doc)
    return {'id': item_id, 'message': 'Lost item reported successfully'}

@api_router.get("/lost/list", response_model=List[LostItem])
async def list_lost_items():
    items = await db.lost_items.find({'status': 'active'}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return items

@api_router.get("/lost/my-items", response_model=List[LostItem])
async def my_lost_items(current_user: User = Depends(get_current_user)):
    items = await db.lost_items.find({'user_id': current_user.id}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return items

@api_router.get("/lost/{item_id}", response_model=LostItem)
async def get_lost_item(item_id: str):
    item = await db.lost_items.find_one({'id': item_id}, {'_id': 0})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

# Found Items
@api_router.post("/found/create")
async def create_found_item(item: FoundItemCreate, current_user: User = Depends(get_current_user)):
    item_id = str(uuid.uuid4())
    item_doc = {
        'id': item_id,
        'user_id': current_user.id,
        'user_email': current_user.email,
        **item.model_dump(),
        'status': 'active',
        'created_at': datetime.now(timezone.utc).isoformat()
    }
    
    await db.found_items.insert_one(item_doc)
    
    # Award points
    await db.users.update_one(
        {'id': current_user.id},
        {'$inc': {'points': 10}}
    )
    
    return {'id': item_id, 'message': 'Found item reported successfully'}

@api_router.get("/found/list", response_model=List[FoundItem])
async def list_found_items():
    items = await db.found_items.find({'status': 'active'}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return items

@api_router.get("/found/my-items", response_model=List[FoundItem])
async def my_found_items(current_user: User = Depends(get_current_user)):
    items = await db.found_items.find({'user_id': current_user.id}, {'_id': 0}).sort('created_at', -1).to_list(100)
    return items

@api_router.get("/found/{item_id}", response_model=FoundItem)
async def get_found_item(item_id: str):
    item = await db.found_items.find_one({'id': item_id}, {'_id': 0})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

# Matches
@api_router.get("/matches/suggestions/{lost_item_id}")
async def get_match_suggestions(lost_item_id: str):
    lost_item = await db.lost_items.find_one({'id': lost_item_id}, {'_id': 0})
    if not lost_item:
        raise HTTPException(status_code=404, detail="Lost item not found")
    
    found_items = await db.found_items.find({'status': 'active'}, {'_id': 0}).to_list(100)
    
    matches = []
    for found_item in found_items:
        # Simple text-based matching
        score = 0
        if lost_item.get('item_name', '').lower() in found_item.get('item_name', '').lower():
            score += 40
        if lost_item.get('location', '').lower() == found_item.get('location', '').lower():
            score += 30
        
        # Image similarity if both have photos
        if lost_item.get('photo') and found_item.get('photo'):
            try:
                img_score = await analyze_image_similarity(lost_item['photo'], found_item['photo'])
                score += img_score * 0.3
            except:
                pass
        
        if score > 20:
            matches.append({
                'id': str(uuid.uuid4()),
                'lost_item': lost_item,
                'found_item': found_item,
                'similarity_score': round(score, 2)
            })
    
    matches.sort(key=lambda x: x['similarity_score'], reverse=True)
    return matches[:10]

# Messages
@api_router.post("/messages/send")
async def send_message(message: MessageCreate, current_user: User = Depends(get_current_user)):
    receiver = await db.users.find_one({'id': message.receiver_id}, {'_id': 0})
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    
    message_id = str(uuid.uuid4())
    message_doc = {
        'id': message_id,
        'sender_id': current_user.id,
        'sender_email': current_user.email,
        'receiver_id': message.receiver_id,
        'receiver_email': receiver['email'],
        'content': message.content,
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'read': False
    }
    
    await db.messages.insert_one(message_doc)
    return {'id': message_id, 'message': 'Message sent successfully'}

@api_router.get("/messages/list", response_model=List[Message])
async def list_messages(current_user: User = Depends(get_current_user)):
    messages = await db.messages.find(
        {'$or': [{'sender_id': current_user.id}, {'receiver_id': current_user.id}]},
        {'_id': 0}
    ).sort('timestamp', -1).to_list(100)
    return messages

@api_router.get("/messages/thread/{user_id}", response_model=List[Message])
async def get_thread(user_id: str, current_user: User = Depends(get_current_user)):
    messages = await db.messages.find(
        {'$or': [
            {'sender_id': current_user.id, 'receiver_id': user_id},
            {'sender_id': user_id, 'receiver_id': current_user.id}
        ]},
        {'_id': 0}
    ).sort('timestamp', 1).to_list(1000)
    return messages

@api_router.post("/messages/mark-read/{message_id}")
async def mark_read(message_id: str, current_user: User = Depends(get_current_user)):
    await db.messages.update_one(
        {'id': message_id, 'receiver_id': current_user.id},
        {'$set': {'read': True}}
    )
    return {'message': 'Marked as read'}

# Admin
@api_router.get("/admin/stats")
async def admin_stats(current_user: User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_lost = await db.lost_items.count_documents({})
    total_found = await db.found_items.count_documents({})
    active_lost = await db.lost_items.count_documents({'status': 'active'})
    active_found = await db.found_items.count_documents({'status': 'active'})
    matched = total_lost + total_found - active_lost - active_found
    
    return {
        'total_lost': total_lost,
        'total_found': total_found,
        'successfully_matched': max(0, matched // 2),
        'active_lost': active_lost,
        'active_found': active_found
    }

@api_router.delete("/admin/delete-post/{item_type}/{item_id}")
async def delete_post(item_type: str, item_id: str, current_user: User = Depends(get_current_user)):
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    collection = db.lost_items if item_type == 'lost' else db.found_items
    result = await collection.delete_one({'id': item_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    
    return {'message': 'Post deleted successfully'}

# User Profile
@api_router.get("/user/profile", response_model=User)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.get("/user/leaderboard")
async def leaderboard():
    users = await db.users.find(
        {'role': 'user'},
        {'_id': 0, 'password_hash': 0}
    ).sort('points', -1).limit(10).to_list(10)
    return users

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()