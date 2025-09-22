import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import BorrowedBooksItem from "../components/ListOfBorrowedBooks";

const Borrowed = () => {
  const [listOfBorrowedBooks, setListOfBorrowedBooks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/user/borrowed/books",
          {
            withCredentials: true,
          }
        );

        setListOfBorrowedBooks(response.data.borrowedBooks);
      } catch (error) {
        console.log("error fetching borrowed books", error);
      }
    };
    fetchBorrowedBooks();
  }, []);

  return (
    <div className="min-h-screen p-10 bg-black mt-20">
      <h1 className="text-white font-semibold text-2xl mb-6">
        Your Borrowed Books: {listOfBorrowedBooks.length}
      </h1>
      <div>
        {listOfBorrowedBooks.length === 0 ? (
          <p>You have not borrowed any books.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2  gap-6">
            {listOfBorrowedBooks.map((item) => (
              <BorrowedBooksItem key={item._id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Borrowed;
