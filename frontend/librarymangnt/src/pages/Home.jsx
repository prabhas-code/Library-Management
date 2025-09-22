import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import BookCard from "../components/BookCard";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { setBooks } = useAuth();
  const [booksList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getBooksList() {
    try {
      const booksResponse = await axios.get("http://localhost:8000/allbooks", {
        withCredentials: true,
      });
      setBookList(booksResponse.data.books);
      setBooks(booksResponse.data.books);
    } catch (error) {
      console.log("error fetching books", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBooksList();
  }, []);
  return (
    <div className="min-h-full overflow-auto flex justify-center items-center  bg-black ">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-600 font-semibold">Loading.....</p>
        </div>
      ) : (
        <div className="  px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-20">
          {booksList.length > 0 ? (
            booksList.map((book) => <BookCard key={book._id} book={book} />)
          ) : (
            <p className="text-center mt-10">No books available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
