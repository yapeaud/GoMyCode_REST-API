// Importation du module Express pour créer une application web
const express = require('express');

// Importation de la fonction connectDB pour établir la connexion à MongoDB
const connectDB = require('./config/db');

// Création de l'application Express
const app = express();

// Connexion à MongoDB en appelant la fonction connectDB
connectDB();

// Middleware pour parser les données JSON dans les requêtes entrantes
// Cela permet de récupérer les données du corps de la requête (req.body) au format JSON
app.use(express.json());

// Importation du modèle User
const User = require('./models/User');

// Définition du port avec fallback sur 4000
const PORT = process.env.PORT || 4000;

// Connexion à MongoDB
connectDB();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Route d'accueil
app.get('/', (req, res) => {
    res.send('🚀 Bienvenue sur mon API Express avec MongoDB et Mongoose !');
});

// 📌 Route pour récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
    }
});

// 📌 Route pour créer un nouvel utilisateur
app.post('/users', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà.' });
        }

        // Créer et sauvegarder le nouvel utilisateur
        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: '✅ Utilisateur créé avec succès', user: newUser });
    } catch (error) {
        res.status(400).json({ message: '❌ Erreur lors de la création de l\'utilisateur', error: error.message });
    }
});

// 📌 Route pour mettre à jour un utilisateur par ID
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Mise à jour des champs
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();

        res.status(200).json({ message: '✅ Utilisateur mis à jour avec succès', user });
    } catch (error) {
        res.status(400).json({ message: '❌ Erreur lors de la mise à jour de l\'utilisateur', error: error.message });
    }
});

// 📌 Route pour supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Supprimer l'utilisateur
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        res.status(200).json({ message: '✅ Utilisateur supprimé avec succès', user });
    } catch (error) {
        res.status(400).json({ message: '❌ Erreur lors de la suppression de l\'utilisateur', error: error.message });
    }
});

// 📌 Lancement du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur en écoute sur http://localhost:${PORT}`);
});
