import { Transaction } from "../model/transactions.model.js";
import User from "../model/users.model.js";
import { Book } from "../model/books.model.js";
import { populate } from "dotenv";

const borrowBook = async (req, res) => {
  try {
    const { user_id, book_id } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const book = await Book.findById(book_id).populate("author", "fullname");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (book.availableCopies < 1) {
      return res.status(400).json({ message: "No copies available" });
    }
    const existingTransaction = await Transaction.findOne({
      user_id: user_id,
      book_id: book_id,
      returned: false,
    });

    if (existingTransaction) {
      return res.status(409).json({
        message:
          "You have already borrowed this book and have not yet returned it.",
      });
    }
    const issuedAt = new Date();
    const returnAt = new Date();
    returnAt.setDate(issuedAt.getDate() + 15);
    const transactions = await Transaction.create({
      user_id: user_id,
      book_id: book_id,
      issuedAt: issuedAt,
      returnAt: returnAt,
      returned: false,
    });
    book.availableCopies -= 1;
    await book.save();

    const populatedTransaction = await Transaction.findById(transactions._id)
      .populate("user_id", "fullname email")
      .populate({
        path: "book_id",
        select: "name genre price author, description",
        populate: { path: "author", select: "fullname" },
      });
    res.status(201).json({
      message: "Book Issued successfully",
      transactions: populatedTransaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const returnBook = async (req, res) => {
  try {
    const { transaction_id } = req.body;
    const transaction = await Transaction.findById(transaction_id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    if (transaction.returned) {
      res.status(401).json({ message: "Book already returned" });
    }
    transaction.returned = true;
    transaction.returnedAt = new Date();
    await transaction.save();

    const book = await Book.findById(transaction.book_id);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }
    res.status(200).json({
      message: "Book returned successfull",
      transaction,
      book: book.name,
      returnBy: req.user.fullname,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
};

export { borrowBook, returnBook };

// {
//     user_id: {
//       type: mongoose.Schema.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     book_id: {
//       type: mongoose.Schema.ObjectId,
//       ref: "Book",
//       required: true,
//     },

//     issuedAt: {
//       type: Date,
//       required: true,
//     },

//     returnAt: {
//       type: Date,
//       required: true,
//     },
//     returned: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
