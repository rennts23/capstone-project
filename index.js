const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(bodyParser.json());

// Import routers
const usersRouter = require("./src/users");
const favoriteRouter = require("./src/favorite");
const solutionRouter = require("./src/solution");


// Endpoint utama
app.get("/", (req, res) => {
  res.send("Service Recommendation API");
});

// Gunakan routers
app.use("/api/users", usersRouter(db));
app.use("/api/favorites", favoriteRouter(db));
app.use("/api/solution", solutionRouter(db)); 

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
