const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");

const multer = require("../middlewares/multer.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", bookController.getAllBooks);
router.get("/bestrating", bookController.getTopBooks);
router.get("/:id", bookController.getBookById);

// *******************************************************************
// Route pour ajouter un nouveau livre
router.post("/", authMiddleware, multer, bookController.addBook);

module.exports = router;