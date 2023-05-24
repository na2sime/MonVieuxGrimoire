const mongoose = require("mongoose");
const {isEmail} = require("validator"); // check if mail is valid
const uniqueValidator = require("mongoose-unique-validator"); // check if mail is unique

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, //Remove spaces before and after
        lowercase: true, //Convert to lowercase
        validate: [isEmail],
    },
    password: {type: String, required: true, trim: true},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);