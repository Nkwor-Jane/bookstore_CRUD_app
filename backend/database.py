from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorCollection
from pymongo import ReturnDocument
from uuid import uuid4

from models import Book, BookCreate, BookUpdate

class BookDAL:
    def __init__(self, collection: AsyncIOMotorCollection):
        self.collection = collection

    async def create_book(self, book_data: BookCreate):
        result = await self.collection.insert_one(book_data.dict())
        doc = await self.collection.find_one({"_id": result.inserted_id})
        return Book.from_doc(doc)

    async def get_all_books(self):
        books = []
        async for doc in self.collection.find():
            books.append(Book.from_doc(doc))
        return books

    async def get_book_by_id(self, book_id: str):
        doc = await self.collection.find_one({"_id": ObjectId(book_id)})
        return Book.from_doc(doc) if doc else None

    async def update_book(self, book_id: str, update_data: BookUpdate):
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(book_id)},
            {"$set": update_dict},
            return_document=ReturnDocument.AFTER
        )
        return Book.from_doc(result) if result else None

    async def delete_book(self, book_id: str):
        result = await self.collection.delete_one({"_id": ObjectId(book_id)})
        return result.deleted_count == 1

