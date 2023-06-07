const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");

const multer = require("../middlewares/multer.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const corsMiddleware = require("../middlewares/cors.middleware");
const imageResizer = require("../middlewares/imageResizer.middleware");

router.get("/", bookController.getAllBooks);
router.get("/bestrating", bookController.getTopBooks);
router.get("/:id", bookController.getBookById);
router.post("/", authMiddleware, multer, imageResizer, bookController.addBook);
router.put("/:id", authMiddleware, multer, imageResizer, bookController.modifyBook);
router.delete("/:id", authMiddleware, bookController.deleteBook);
router.post('/:id/rating', authMiddleware, bookController.rateBook);

module.exports = router;