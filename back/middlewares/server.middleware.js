//la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne

exports.normalizePort = (val) => {
    // Conversion de la valeur en un entier (nombre de port)
    const port = parseInt(val, 10);

    // Vérification si la conversion a échoué
    if (isNaN(port)) {
        return val; // Retourne la valeur d'origine si ce n'est pas un nombre
    }

    // Vérification si le nombre de port est valide
    if (port >= 0) {
        return port; // Retourne le nombre de port si c'est valide
    }
    return false; // Retourne false si le nombre de port est non valide
};

//la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur

exports.errorHandler = (error) => {
    // Vérification si l'erreur n'est pas liée à l'appel système "listen"
    if (error.syscall !== "listen") {
        throw error; // Lancer l'erreur si ce n'est pas lié à "listen"
    }

    // Obtention de l'adresse à laquelle le serveur est lié
    const address = server.address();

    // Construction de la chaîne de caractères pour l'affichage
    const bind =
        typeof address === "string" ? "pipe " + address : "port: " + port;
    switch (
        error.code // Traitement des différents codes d'erreur possibles
        ) {
        case "EACCES": // Cas d'erreur "EACCES" - privilèges insuffisants
            console.error(bind + " requires elevated privileges."); // Affichage du message d'erreur correspondant
            process.exit(1); // Terminer le processus avec un code d'erreur: !!une fin anormale!!(convention courante)
            break;
        case "EADDRINUSE": // Cas d'erreur "EADDRINUSE" - port déjà utilisé
            console.error(bind + " is already in use."); // Affichage du message d'erreur correspondant
            process.exit(1); // Terminer le processus avec un code d'erreur
            break;
        default: // Cas d'erreur par défaut
            throw error; // Lancer l'erreur par défaut pour la traiter ailleurs
    }
};