import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Star } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Borrow = () => {
  const { state } = useLocation();
  const { user } = useAuth();
  // console.log("user", user);

  const { book } = state || {};
  console.log("book", book);
  if (!book) {
    return (
      <p className="text-center text-red-600 mt-10">
        Book data missing. Please go back and try again.
      </p>
    );
  }

  const hanldeBorrrow = async () => {
    try {
      const postData = {
        user_id: user._id,
        book_id: book._id,
      };
      const response = await axios.post(
        "http://localhost:8000/borrow",
        postData,
        {
          withCredentials: true,
        }
      );

      console.log("data", response.data);

      console.log("borrow message", response.data.message);
      toast.success(response.data.message || "Book Borrowed Successfully");
    } catch (error) {
      console.log("error borrowing book", error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="h-screen flex mt-14 p-10 justify-center items-center bg-gray-200">
      <div
        id="card"
        className="bg-black rounded-2xl overflow-hidden shadow-[0_0_15px_white] hover:shadow-[0_0_30px_white] transition-opacity duration-300 ml-5  border-white mr-5 flex flex-col justify-between h-4/5"
      >
        {/* Thumbnail with badges */}
        <div className="relative ">
          {/* Genre Badge */}
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {book.genre}
          </span>

          {/* Availability Badge */}
          <span className="absolute top-2 right-2 bg-white text-green-600 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            {book.availableCopies} left
          </span>
        </div>
        <div className="mt-10">
          <img
            src={book.thumbnailphoto || "https://via.placeholder.com/400x250"}
            alt={book.name}
            className="w-76 h-46 object-contain mx-auto mt-3 "
          />
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-white">{book.name}</h2>
          <p className="text-gray-500 mt-1 text-sm line-clamp-2">
            {book.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <span className="mr-4">🧑 Author : {book.author.fullname}</span>
            <span>📅 {new Date(book.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Price + Rating */}
          <div className="flex items-center justify-between mt-4 mb-4">
            <p className="text-lg font-bold text-white">
              ₹{book.price.toLocaleString()}
            </p>
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="gold" stroke="gold" />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-auto ">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg w-full px-2 py-1">
              Buy
            </button>
          </div>
        </div>
      </div>
      {/* Form to borrow the book using the book details */}
      <div className="w-1/2 ml-6 bg-white p-6 rounded-lg shadow-md h-4/5">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Borrow Details
        </h2>

        <div className="space-y-3">
          <p>
            <b>Borrower Name :</b> {user.fullname}{" "}
          </p>
          <p>
            <b>Book :</b> {book.name}{" "}
          </p>
          {/* <p>
            <b>Genre :</b> {book.genre}{" "}
          </p> */}
          <p>
            <b>Description :</b> {book.description}
          </p>
          <p>
            <b>Book Updated At :</b>{" "}
            {new Date(book.createdAt).toLocaleDateString()}
          </p>
          <p>
            <b>Author :</b> {book.author?.fullname || "Unknown"}
          </p>
          <p>
            <b>Issued on :</b> {new Date().toLocaleDateString()}
          </p>

          <p>
            <b>Return by : </b>
            {new Date(
              Date.now() + 15 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
            (<span className="text-red-600">{"After 15days"}</span>)
          </p>

          <button
            onClick={hanldeBorrrow}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg w-full mt-4"
          >
            Confirm Borrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Borrow;
