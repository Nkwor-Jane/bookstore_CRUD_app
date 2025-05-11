from contextlib import asynccontextmanager
from datetime import datetime
import os
from dotenv import load_dotenv
import sys
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from fastapi import FastAPI, Request, status, HTTPException, Depends, Request
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import uvicorn

from models import Book, BookCreate, BookUpdate
from database import BookDAL

load_dotenv()

COLLECTION_NAME= "book_lists"
MONGODB_URI= os.environ["MONGODB_URI"]
DEBUG= os.environ.get("DEBUG", "").strip().lower() in {"1", "true", "on", "yes" }

@asynccontextmanager
async def lifespan(app: FastAPI):
    client = AsyncIOMotorClient(MONGODB_URI)
    database = client.get_default_database()

    pong = await database.command("ping")
    if int(pong["ok"]) != 1:
        raise Exception("Cluster connection is not okay!")
    
    book_lists = database.get_collection(COLLECTION_NAME)
    app.book_dal = BookDAL(book_lists)

    yield
    client.close()

app = FastAPI(lifespan=lifespan, debug=DEBUG)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_dal(request: Request) -> BookDAL:
    return request.app.book_dal

@app.get("/")
def home():
    return {"message": "Welcome to the BookStore CRUD API"} 

@app.post("/books", response_model=Book)
async def create_book(book: BookCreate, dal: BookDAL = Depends(get_dal)):
    return await dal.create_book(book)

@app.get("/books", response_model=list[Book])
async def get_books(dal: BookDAL = Depends(get_dal)):
    return await dal.get_all_books()

@app.get("/books/{book_id}", response_model=Book)
async def get_book(book_id: str, dal: BookDAL = Depends(get_dal)):
    book = await dal.get_book_by_id(book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.patch("/books/{book_id}", response_model=Book)
async def update_book(book_id: str, updates: BookUpdate, dal: BookDAL = Depends(get_dal)):
    book = await dal.update_book(book_id, updates)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found or no updates applied")
    return book

@app.delete("/books/{book_id}")
async def delete_book(book_id: str, dal: BookDAL = Depends(get_dal)):
    success = await dal.delete_book(book_id)
    if not success:
        raise HTTPException(status_code=404, detail="Book not found")
    return {"message": "Book deleted successfully"}