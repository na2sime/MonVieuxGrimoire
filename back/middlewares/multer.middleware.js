const multer = require("multer"); //Package qui gère le upload de fichier

const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
};

// Configuration de Multer pour gérer la Limite de taille de fichier en octets (4 Mo)
const maxFileSize = 4 * 1024 * 1024;

// Configuration de Multer pour gérer la destination des fichiers
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images"); //
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension); // Génère un nom de fichier unique
    },
});

// Vérification du type de fichier uploadé
const fileFilter = (req, file, callback) => {
    // Vérifie le type de fichier
    if (file.mimetype.startsWith("image/")) {
        callback(null, true); // Accepte le fichier
    } else {
        callback(new Error("Le fichier doit être une image..."), false); // Rejette le fichier
    }
};

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxFileSize },
}).single("image");