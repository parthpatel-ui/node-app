const express = require("express");
const router = express.Router();
const { userRegistration, userLogin } = require("../controllers/userController.js");

router.post("/register", userRegistration);

router.post("/login", userLogin);

module.exports = router;
