// Importation du module mongoose pour interagir avec MongoDB
const mongoose = require('mongoose');

// Chargement des variables d'environnement à partir du fichier .env
require('dotenv').config();

// Définition de la fonction asynchrone connectDB pour établir la connexion à MongoDB
const connectDB = async () => {
    try {
        // Tentative de connexion à la base de données MongoDB en utilisant l'URI stockée dans les variables d'environnement
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Utilisation du nouveau parser d'URL pour éviter les avertissements de dépréciation
            useUnifiedTopology: true, // Utilisation de la topologie unifiée pour améliorer la gestion des connexions
        });
        // Si la connexion réussit, un message de confirmation est affiché
        console.log("✅ MongoDB connecté !");
    } catch (error) {
        // En cas d'erreur lors de la connexion, un message d'erreur est affiché
        console.error("❌ Erreur de connexion :", error);
        // Le processus est terminé avec un code d'erreur (1) pour indiquer une issue fatale
        process.exit(1);
    }
};

// Exportation de la fonction connectDB pour pouvoir l'utiliser dans d'autres fichiers
module.exports = connectDB;