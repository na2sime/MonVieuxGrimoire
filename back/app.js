const express = require("express");
const bodyParser = require("body-parser"); //Package gére à analyser data dans corps des requêtes
const path = require("path"); // Package qui gère le chemin des fichier
const app = express();
const connectApi = require("./config/dataBase");
const bookRoutes = require("./routes/book.routes");
const userRoute = require("./routes/user.routes");
const corsMiddleware = require("./middlewares/cors.middleware");
require("dotenv").config({path: "./config/.env"});

connectApi();

//Custom le Headers des requêtes!
app.use(corsMiddleware);

app.use(bodyParser.json());

//Récuperer la data encodé sous forme URL
app.use(bodyParser.urlencoded({extended: true}));

//ROUTES
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoute);
app.use("/book_picture", express.static(path.join(__dirname, "/images")));

module.exports = app;