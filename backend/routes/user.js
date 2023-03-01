const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const emailValidator = require("../middleware/emailValidator");
router.post("/signup", emailValidator, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
