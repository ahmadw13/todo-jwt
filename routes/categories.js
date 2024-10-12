"use strict";
//categories routes for easier CRUD on them
const express = require("express");

const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/auth");
router.post(
  "/custom-categories",
  authMiddleware,
  todoController.saveCustomCategory
);
router.get("/custom-categories", authMiddleware, todoController.getCategories);
router.delete(
  "/custom-categories",
  authMiddleware,
  todoController.deleteAllCustomCategories
);
module.exports = router;
