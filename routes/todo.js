"use strict";
//todo's routes for CRUD
const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, todoController.createTodo);

router.get("/", authMiddleware, todoController.getTodos);

router.put("/:id", authMiddleware, todoController.updateTodo);
router.delete("/all", authMiddleware, todoController.deleteAllTodos);

router.delete("/:id", authMiddleware, todoController.deleteTodo);
module.exports = router;
