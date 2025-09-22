import { Book } from "../model/books.model.js";
import User from "../model/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

//********author*********
const createBook = async (req, res) => {
  try {
    const { name, description, genre, availableCopies, price } = req.body;
    const file = req.file;
    let fileUrl = null;
    if (file) {
      // upload file to cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(file.path);
      fileUrl = cloudinaryResponse.url;
    }
    const authorName = await User.findById(req.user.id);
    const book = await Book.create({
      name,
      description,
      genre,
      availableCopies,
      price,
      thumbnailphoto: fileUrl,
      author: req.user.id || null,
      authorName: authorName.name || "Unknown",
    });

    await book.save();
    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBooks = async (req, res) => {
  try {
    let books;
    console.log("req obj", req);

    if (req.user.role === "author") {
      books = await Book.find({ author: req.user._id });
    }

    res
      .status(200)
      .json({ message: " books fetched successfully", books: books });
  } catch (error) {
    console.log(error);
    res.status(401).json("Some thing went wrong");
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json("Book not Found");
    }

    if (
      req.user.role === "author" &&
      book.author.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json("Unauthorized Not your book");
    }
    Object.assign(book, req.body);
    let file = req.file;
    let fileUrl = "";
    if (file) {
      const cloudinaryResponse = await uploadOnCloudinary(file.path);
      fileUrl = cloudinaryResponse.url;
    }
    book.thumbnailphoto = fileUrl;
    await book.save();
    res.status(201).json({ message: "Updated successfully", book: book });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server error");
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json("Book not found");
    }
    res.status(200).json("Book deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { createBook, getBooks, updateBook, deleteBook };
