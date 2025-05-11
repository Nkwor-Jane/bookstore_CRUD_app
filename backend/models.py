from pydantic import BaseModel, Field
from typing import Optional
from bson import ObjectId

class Book(BaseModel):
    id: str
    title: str
    author: str
    summary: str

    @staticmethod
    def from_doc(doc) -> "Book":
        return Book(
            id=str(doc["_id"]),
            title=doc["title"],
            author=doc["author"],
            summary=doc["summary"]
        )

class BookCreate(BaseModel):
    title: str
    author: str
    summary: str

class BookUpdate(BaseModel):
    title: Optional[str]
    author: Optional[str]
    summary: Optional[str]