import { useEffect, useState } from "react";
import axios from "axios";

import BookForm from "./BookForm"

const API_URL = "http://localhost:8001/books";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);

  const loadBooks = async () => {
    const res = await axios.get(API_URL);
    setBooks(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    loadBooks();
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const cancelEdit = () => {
    setEditingBook(null);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Bookstore CRUD App</h2>
      <BookForm onBookAdded={loadBooks} editingBook={editingBook} onCancelEdit={cancelEdit} />
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h3 className="text-xl font-semibold mb-4">Books</h3>
        {books.length === 0 ? (
          <p className="text-gray-600">No books available.</p>
        ) : (
            <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Summary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{book.summary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-500 hover:text-blue-700 mr-2 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
