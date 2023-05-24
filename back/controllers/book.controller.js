const bookModel = require("../models/book.model");

// Get All
exports.getAllBooks = async (req, res) => {
    try {
        const books = await bookModel.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({error: "récupération des livres échoué"});
    }
};

// Get by ID
exports.getBookById = async (req, res) => {
    try {
        const book = await bookModel.findOne({_id: req.params.id});
        if (!book) {
            return res.status(404).json({error: "Livre introuvable"});
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({error: "récupération du livre échoué"});
    }
};

// Get TOP 3
exports.getTopBooks = async (req, res) => {
    try {
        const books = await bookModel.find().sort({averageRating: -1}).limit(3);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({error: "récupération des livres échoué"});
        console.log("Erreur:", error);
    }
};

exports.addBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new bookModel({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/book_picture/${
            req.file.filename
        }`,
    });
    book.save().then(() => {
        console.log(`Nouveau livre:${bookObject.title}`);
        res.status(201).json({message: "Livre enregistré avec succès"});
    })
        .catch((error) => {
            console.log(error);
            res.status(400).json({error});
        });
};