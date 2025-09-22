import React from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/Login";

const BookCard = ({ book }) => {
  const { user } = useAuth();
  console.log("user", user);
  const navigate = useNavigate();
  const handleClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/borrow", { state: { book } });
    }
  };
  return (
    <div
      id="card"
      className="bg-black rounded-2xl overflow-hidden shadow-[0_0_15px_white] hover:shadow-[0_0_30px_white] transition-opacity duration-300 ml-5  border-white mr-5 flex flex-col justify-between h-full"
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg w-1/2 px-2 py-1">
            Buy
          </button>
          <button
            onClick={handleClick}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold  rounded-lg w-1/2 px-2 py-1"
          >
            Borrow Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
