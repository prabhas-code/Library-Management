import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Return = () => {
  const { user } = useAuth();
  // console.log("user", user);

  const { state } = useLocation();

  const { item } = state || {};
  // console.log("items for return books", item);
  // console.log("id", item._id);

  const handleReturn = async () => {
    try {
      // ✅ Corrected: Send the transaction ID in a JSON object
      const response = await axios.post(
        "http://localhost:8000/return",
        { transaction_id: item._id },
        {
          withCredentials: true,
        }
      );
      console.log("book return response", response);
      toast.success(response.data.message);
    } catch (error) {
      console.error(
        "Error returning book",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Something went wrong.");
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
            {item.book_id.genre}
          </span>

          {/* Availability Badge */}
        </div>
        <div className="mt-10">
          <img
            src={
              item.book_id.thumbnailphoto ||
              "https://via.placeholder.com/400x250"
            }
            alt={item.book_id.name}
            className="w-76 h-46 object-contain mx-auto mt-3 "
          />
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-white">{item.book_id.name}</h2>
          <p className="text-gray-500 mt-1 text-sm line-clamp-2">
            {item.book_id.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <span className="mr-4">
              🧑 Author : {item.book_id.author.fullname}
            </span>
            <span>📅 {new Date(item.createdAt).toLocaleDateString()}</span>
          </div>

          {/* Price + Rating */}
          <div className="flex items-center justify-between mt-4 mb-4">
            <p className="text-lg font-bold text-white">
              ₹{item.book_id.price.toLocaleString()}
            </p>
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
          Return Details
        </h2>

        <div className="space-y-3">
          <p>
            <b>Name of the Returner :</b> {user.fullname}{" "}
          </p>
          <p>
            <b>Book :</b> {item.book_id.name}{" "}
          </p>
          {/* <p>
            <b>Genre :</b> {book.genre}{" "}
          </p> */}
          {/* <p>
            <b>Description :</b> {book.description}
          </p> */}
          {/* <p>
            <b>Book Updated At :</b>{" "}
            {new Date(book.createdAt).toLocaleDateString()}
          </p> */}
          <p>
            <b>Author :</b> {item.book_id.author?.fullname || "Unknown"}
          </p>
          <p>
            <b>Issued on :</b> {new Date().toLocaleDateString()}
          </p>

          <p>
            <b>Return At : </b>
            {new Date(
              Date.now() + 15 * 24 * 60 * 60 * 1000
            ).toLocaleDateString()}
            (<span className="text-red-600">{"After 15days"}</span>)
          </p>

          <button
            onClick={handleReturn}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg w-full mt-4"
          >
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
};

export default Return;
