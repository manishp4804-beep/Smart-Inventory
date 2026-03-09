const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");
const { getUsers } = require("../controllers/UserController");

const router = express.Router();

router.get("/", authMiddleware, getUsers);

module.exports = router;
