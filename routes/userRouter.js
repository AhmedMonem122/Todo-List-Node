const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", userController.getAllUsers);

router.post("/signup", userController.register);

router.post("/signin", userController.login);

module.exports = router;
