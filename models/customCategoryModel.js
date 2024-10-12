"use strict";
//this model is about the custom categories
const pool = require("../config/db");

class CustomCategory {
  static async add(userId, category) {
    try {
      const result = await pool.query(
        "INSERT INTO custom_categories (user_id, category_name) VALUES ($1, $2) RETURNING *",
        [userId, category]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error adding custom category:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      "SELECT * FROM custom_categories WHERE user_id = $1",
      [userId]
    );
    return result.rows;
  }
}

module.exports = CustomCategory;
