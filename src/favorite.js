const express = require("express");
const router = express.Router();

module.exports = (db) => {
  const usersCollection = db.collection("users");

  // Tambah atau hapus tempat favorit
  router.post("/", async (req, res) => {
    const { email, serviceId } = req.body;

    if (!email || !serviceId) {
      return res.status(400).json({ error: "Email and serviceId are required" });
    }

    try {
      const userDoc = await usersCollection.doc(email).get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userDoc.data();
      const favorites = userData.favorites || [];

      if (favorites.includes(serviceId)) {
        // Hapus dari favorit
        const updatedFavorites = favorites.filter((id) => id !== serviceId);
        await usersCollection.doc(email).update({ favorites: updatedFavorites });
        return res.status(200).json({ message: "Service removed from favorites", favorites: updatedFavorites });
      } else {
        // Tambah ke favorit
        favorites.push(serviceId);
        await usersCollection.doc(email).update({ favorites });
        return res.status(200).json({ message: "Service added to favorites", favorites });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dapatkan daftar favorit pengguna
  router.get("/:email", async (req, res) => {
    const { email } = req.params;

    try {
      const userDoc = await usersCollection.doc(email).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "User not found" });
      }

      const userData = userDoc.data();
      res.status(200).json({ favorites: userData.favorites || [] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
