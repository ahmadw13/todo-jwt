"use strict";
//Server settings and start point
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");
const categoryRoutes = require("./routes/categories.js");
const cors = require('cors');
dotenv.config();
const app = express();
app.use(cors({
  origin: 'http://127.0.0.1:5500',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));
app.use(cookieParser());
app.use(bodyParser.json());


// Routes
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);
app.use("/categories", categoryRoutes);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});
