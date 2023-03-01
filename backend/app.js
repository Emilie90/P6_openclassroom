const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
const path = require("path");
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const Keygrip = require("keygrip");
require("dotenv").config();

const app = express();
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

var expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
app.use(
  cookieSession({
    name: "session",
    keys: new Keygrip(["key1", "key2"], "SHA384", "base64"),
    cookie: { secure: true, httpOnly: true, expires: expiryDate },
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.mongo_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use("/api/auth", userRoutes);

app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
module.exports = app;
