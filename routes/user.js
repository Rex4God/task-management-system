"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../app/controllers/UserController")
const { authenticateUser}=require("../app/middleware/authentication")

router.post("/",controller.createUser)

router.post("/login", controller.login)

router.get("/", authenticateUser,controller.fetchUsers)

router.get("/:userId",authenticateUser,controller.getUser)

router.put("/:userId",authenticateUser,controller.updateUser)

router.delete("/:userId",authenticateUser,controller.deleteUser)




module.exports =router;