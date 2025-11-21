// src/routes/groupRoutes.js
const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

router.get("/", groupController.listGroups);
router.get("/pivot", groupController.pivot);

module.exports = router;
