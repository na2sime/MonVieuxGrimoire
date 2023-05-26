const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");

//Voir tous les user dans DataBase
router.get("/test", async (req, res) => {
    const users = await userModel.find().select("-password");
    res.status(200).json({ message: "Test GET du serveur réussi !", ...users });
});

module.exports = router;