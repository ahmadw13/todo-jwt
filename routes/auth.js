    "use strict";
    //authentication routes
    const express = require("express");
    const router = express.Router();
    const authController = require("../controllers/authController");

    router.post("/login", authController.login);
    router.post("/register", authController.register);

    router.post("/refresh-token", authController.refreshToken);

    router.post("/logout", authController.logout);

    module.exports = router;
