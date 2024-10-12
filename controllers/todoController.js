"use strict";

const Todo = require("../models/todoModel");
const pool = require("../config/db");





exports.createTodo = async (req, res) => {
  const { title, description, date_time, category } = req.body;  
  const userId = req.user.id;

  if (!title || !description || !date_time || !category) {
    return res.status(400).json({
      error: "Title, description, date/time, and category are required.",
    });
  }

  try {
    // We no longer need to check if it's a custom category if no special handling is required
    const newTodo = await Todo.create(userId, title, description, date_time, category);

    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};


exports.getTodos = async (req, res) => {
  const userId = req.user.id;
  const category = req.query.category; // Get category from query parameters

  try {
    // If a category is provided, filter todos by category
    const todos = category 
      ? await Todo.findByUserIdAndCategory(userId, category) 
      : await Todo.findByUserId(userId); // Otherwise, get all todos for the user

    res.status(200).json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, date_time, category, done } = req.body;  
  const userId = req.user.id;

   const updatedFields = {};

   if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (date_time) updatedFields.date_time = date_time;
  if (category) updatedFields.category = category;
  if (typeof done !== 'undefined') updatedFields.done = done;  

  try {
      const updatedTodo = await Todo.update(id, userId, updatedFields); 
      if (!updatedTodo) {
          return res.status(404).json({ error: "Todo not found or does not belong to user" });
      }
      res.status(200).json(updatedTodo);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Database error", details: error.message });
  }
};



exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedTodo = await Todo.remove(id, userId);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found or does not belong to user" });
    }
    res.status(200).json({ message: "Todo deleted successfully", deletedTodo });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

exports.saveCustomCategory = async (req, res) => {
  const userId = req.user.id;
  const { category } = req.body;

  try {
    await pool.query(
      "INSERT INTO custom_categories (user_id, category_name) VALUES ($1, $2)",
      [userId, category]
    );
    res.status(201).json({ message: "Custom category saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

exports.getCategories = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const result = await pool.query(
      "SELECT * FROM custom_categories WHERE user_id = $1",
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

exports.deleteAllCustomCategories = async (req, res) => {
  const userId = req.user.id;
  
  try {
    const result = await pool.query(
      "DELETE FROM custom_categories WHERE user_id = $1 RETURNING *",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No custom categories found for the user." });
    }

    res.status(200).json({ message: "All custom categories deleted successfully." });
  } catch (error) {
    console.error("Error deleting custom categories:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};

exports.deleteAllTodos = async (req, res) => {
  const userId = req.user.id;

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const result = await Todo.deleteAllByUserId(parseInt(userId));

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No todos found for this user." });
    }

    res.status(200).json({ message: "All todos deleted successfully." });
  } catch (error) {
    console.error("Error deleting all todos:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
};
