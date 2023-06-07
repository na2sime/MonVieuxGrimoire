const jwt = require("jsonwebtoken"); // Package qui permet de créer et vérifier les tokens d'authentification

module.exports = (req, res, next) => {
    try {
        // Récupération du token dans le header de la requête
        const token = req.headers.authorization.split(" ")[1];
        // Vérification du token
        const decodedToken = jwt.verify(token, process.env.TOKEN);
        const userId = decodedToken.userId;
        // Vérification de l'authentification
        req.auth = {
            userId: userId,
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
};