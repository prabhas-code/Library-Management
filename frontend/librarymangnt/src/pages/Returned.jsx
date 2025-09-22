import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { BookOpenCheck } from "lucide-react"; // icon

const Returned = () => {
  const [returnedBooks, setReturnedBooks] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReturnedBooks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/user/returned/books",
          { withCredentials: true }
        );
        console.log(response);
        setReturnedBooks(response.data.returnedBooks || []);
      } catch (error) {
        console.error("Error fetching returned books", error);
      }
    };
    fetchReturnedBooks();
  }, []);

  return (
    <div className="min-h-screen bg-black pt-24 px-8 mt-5">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        ✅ Your Returned Books
      </h1>

      {returnedBooks.length === 0 ? (
        <p className="text-center text-gray-600">
          You haven’t returned any books yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {returnedBooks.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border-4 border-green-200 hover:shadow-xl transition flex flex-col"
            >
              {/* Thumbnail */}
              <div className="h-60 w-full bg-gray-100 flex items-center justify-center">
                <img
                  src={
                    item.book_id?.thumbnailphoto ||
                    "https://via.placeholder.com/400x250"
                  }
                  alt={item.book_id?.name}
                  className="h-full w-full "
                />
              </div>

              {/* Book Info */}
              <div className="p-5 flex flex-col flex-1 bg-black">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpenCheck className="text-green-600" size={24} />
                  <h2 className="text-lg font-bold text-white">
                    {item.book_id?.name}
                  </h2>
                </div>
                <p className="text-sm mb-1">
                  <span className="text-gray-400">Genre:</span>{" "}
                  <span className="text-gray-200">{item.book_id?.genre}</span>
                </p>
                <p className="text-sm mb-1">
                  <span className="text-gray-400">Author:</span>{" "}
                  <span className="text-gray-200">
                    {item.book_id?.author?.fullname}
                  </span>
                </p>
                <p className="text-sm mb-3">
                  <span className="text-gray-400">Price:</span>{" "}
                  <span className="text-gray-200">₹{item.book_id?.price}</span>
                </p>
                <div className="mt-auto text-sm text-gray-200">
                  <p>
                    <b>Issued:</b>{" "}
                    {new Date(item.issuedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <b>Returned:</b>{" "}
                    {new Date(item.returnAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Status Badge */}
                <div className="mt-4 bg-green-100 text-green-700 px-3 py-1 rounded-lg text-center font-semibold">
                  Returned Successfully
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Returned;
