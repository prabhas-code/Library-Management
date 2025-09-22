import express from "express";
import {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
} from "../controllers/book.controllers.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import isAuthor from "../middlewares/isauthor.middlewares.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { upload } from "../middlewares/multer.middlewares.js";
const bookRouter = express.Router();

bookRouter.post(
  "/createbook",
  verifyToken,
  isAuthor,
  upload.single("thumbnail"),
  createBook
);
bookRouter.get("/books", verifyToken, getBooks);
bookRouter.put(
  "/updatebook/:id",
  verifyToken,
  isAuthor,
  upload.single("file"),
  updateBook
);
bookRouter.delete("/deletebook", verifyToken, isAuthor, deleteBook);

export { bookRouter };
