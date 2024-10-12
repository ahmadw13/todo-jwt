"use strict";
//Todo Model is the CRUD of the todos
const pool = require("../config/db");

class Todo {
  static async create(userId, title, description, dateTime, category) {
    try {
      const result = await pool.query(
        "INSERT INTO todos (user_id, title, description, date_time, category) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [userId, title, description, dateTime, category]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating todo:", error);
      throw new Error("Database error: " + error.message);
    }
  }
   
  static async findByUserId(userId) {
    const result = await pool.query("SELECT * FROM todos WHERE user_id = $1", [
      userId,
    ]);
    return result.rows;
  }
  static async findByUserIdAndCategory(userId, category) {
    const query = `SELECT * FROM todos WHERE user_id = $1 AND category = $2`;
    const params = [userId, category];

    const result = await pool.query(query, params);
    return result.rows;
  }

static async update(id, userId, updatedFields) {
     const fields = Object.keys(updatedFields);
    const values = Object.values(updatedFields);

     if (fields.length === 0) {
        throw new Error("No fields to update.");
    }

     const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

     const query = `
        UPDATE todos 
        SET ${setString} 
        WHERE id = $${fields.length + 1} AND user_id = $${fields.length + 2} 
        RETURNING *`;

     const result = await pool.query(query, [...values, id, userId]);

     if (result.rowCount === 0) {
        throw new Error("Todo not found or does not belong to user.");
    }

     return result.rows[0];
}


  static async removeAllCategories(userId) {
    try {
      await pool.query("DELETE FROM custom_categories WHERE user_id = $1", [
        userId,
      ]);
    } catch (error) {
      console.error("Error deleting custom categories:", error);
      throw new Error("Database error: " + error.message);
    }
  }

  static async remove(id, userId) {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    return result.rows[0];
  }

  static async deleteAllByUserId(userId) {
    const query = "DELETE FROM todos WHERE user_id = $1 RETURNING *";
    const values = [userId];

    try {
      const result = await pool.query(query, values);
      return result;
    } catch (error) {
      console.error("Error deleting todos:", error);
      throw error;
    }
  }
}

module.exports = Todo;
