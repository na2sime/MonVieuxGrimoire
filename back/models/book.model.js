const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
    userId: {type: String, required: true},
    title: {type: String, required: false},
    author: {type: String, required: false},
    imageUrl: {type: String, required: true},
    year: {type: Number, required: false},
    genre: {type: String, required: false},
    //notes données à un livre
    ratings: [
        {
            userId: {type: String, required: true},
            grade: {type: Number, required: true},
        },
    ],
    averageRating: {type: Number, required: true},
});

module.exports = mongoose.model("Book", bookSchema);