const bookModel = require("../models/book.model");
const fs = require('fs');

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

// Add book
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
        console.log(`Nouveau livre: ${bookObject.title}`);
        res.status(201).json({message: "Livre enregistré avec succès"});
    })
        .catch((error) => {
            console.log(error);
            res.status(400).json({error});
        });
};

// Modify book
exports.modifyBook = (req, res) => {
    const bookObject = req.file
        ? {
            ...JSON.parse(req.body.book),
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get("host")}/book_picture/${req.file.filename}`,
        }
        : {...req.body};

    delete bookObject._userId;

    bookModel.findOne({_id: req.params.id}).then((book) => {
        if (book.userId !== req.auth.userId) {
            res.status(401).json({message: "Non autorisé"});
        } else {
            bookModel.updateOne(
                {_id: req.params.id},
                {...bookObject, _id: req.params.id}
            )
                .then(() => res.status(200).json({message: "Objet modifié !"}))
                .catch((error) => res.status(401).json({error}));
        }
    })
        .catch((error) => {
            console.log(error);
            res.status(400).json({error});
        });
};

// Delete book
exports.deleteBook = (req, res, next) => {
    bookModel.findOne({_id: req.params.id}).then((book) => {
        if (book.userId !== req.auth.userId) {
            res.status(401).json({message: "Non autorisé"});
        } else {
            const filename = book.imageUrl.split("/book_picture/")[1];
            console.log(filename);
            fs.unlink(`images/${filename}`, (err) => {
                if (err) {
                    console.log("Erreur lors de la suppression de l'image1 :", err);
                    res.status(500).json({error: "Erreur lors de la suppression de l'image2"});
                } else {
                    bookModel.deleteOne({_id: req.params.id}).then(() => {
                        console.log("Livre supprimé avec succès !");
                        res.status(200).json({message: "Objet supprimé !"});
                    }).catch((error) => {
                        console.log("Erreur lors de la suppression du livre3 :", error);
                        res.status(401).json({error});
                    });
                }
            });
        }
    }).catch((error) => {
        console.log("Erreur lors de la recherche du livre :", error);
        res.status(500).json({"Erreur lors de la recherche du livre": error});
    });
};

//rate book
exports.rateBook = (req, res) => {
    const url = req.url;
    const urlId = url.split('/')[1];
    const bookFilter = {_id: urlId};
    const updatedUserId = req.body.userId;
    const updatedGrade = req.body.rating;
    console.log(req.body);
    const updatedData = {
        userId: updatedUserId,
        grade: updatedGrade,
    };

    bookModel.findOneAndUpdate(
        bookFilter,
        {$push: {ratings: updatedData}},
        {new: true}
    ).then((updatedBook) => {
        const totalRatings = updatedBook.ratings.length;
        const ratingsSum = updatedBook.ratings.reduce(
            (acc, rating) => acc + rating.grade,
            0
        );
        updatedBook.averageRating = ratingsSum / totalRatings;

        return updatedBook.save();
    }).then((book) => {
        res.status(200).json(book);
    }).catch((error) => res.status(400).json({error}));
};