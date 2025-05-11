import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8001/books";

export default function BookForm({ onBookAdded,  editingBook, onCancelEdit  }) {
  const [book, setBook] = useState({
    title: "",
    author: "",
    summary: "",
  });

  useEffect(() => {
    if (editingBook) {
      setBook({
        title: editingBook.title,
        author: editingBook.author,
        summary: editingBook.summary,
      });
    } else {
        setBook({
            title: "",
            author: "",
            summary: "",
        })
    }
  }, [editingBook]); 

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    const payload = {
      ...book,
    };

    if (editingBook) {
      await axios.patch(`${API_URL}/${editingBook.id}`, payload);
      onCancelEdit();
    } else {
      await axios.post(API_URL, payload);
    }
    onBookAdded();
    setBook({ title: "", author: "", summary: "" });
  };

  return (
    <form onSubmit={handleSubmit} 
    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {["title", "author", "summary"].map((field) => (
        <div className="mb-4" key={field}>
            <label className="block text-gray-700 text-sm font-bold mb-2 capitalize" htmlFor={field}>
            {field}
            </label>
            <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline placeholder-gray-400"
            key={field}
            name={field}
            placeholder={field}
            value={book[field]}
            onChange={handleChange}
            required
            />
        </div>
      ))}
      <div className="flex items-center justify-between">
      <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          {editingBook ? "Update Book" : "Add Book"}
        </button>
        {editingBook && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="ml-4 bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
