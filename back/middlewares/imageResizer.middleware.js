const Jimp = require("jimp"); // Package qui permet de redimensionner les images

const resizeImageMiddleware = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const imagePath = req.file.path;

    try {
        const image = await Jimp.read(imagePath);
        await image
            .resize(Jimp.AUTO, 700) // Redimensionner l'image en 700px de hauteur et conserver le ratio
            .quality(80) // Ajuster la qualité de l'image JPG (0-100)
            .contain(500, Jimp.AUTO) // Redimensionner l'image en 500px de largeur et conserver le ratio
            .writeAsync(imagePath); // Écrire l'image redimensionnée en écrasant l'ancienne image

        console.log(
            "Image convertie en format JPG et redimenssionnée"
        );
        next();
    } catch (error) {
        console.log("Une erreur est survenue lors du traitement de l'image !");
        console.error(error);
        res.status(500).json({
            error: "Une erreur est survenue lors du traitement de l'image !",
        });
    }
};

module.exports = resizeImageMiddleware;