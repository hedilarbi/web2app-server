const express = require("express");

const { createUser } = require("../controllers/notifTokens");

const router = express.Router();

router.post("/", createUser);

module.exports = router;
