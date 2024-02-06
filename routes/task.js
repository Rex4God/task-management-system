"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../app/controllers/TaskController")
const {authenticateUser} = require("../app/middleware/authentication")


router.post("/", authenticateUser,controller.createTask);

router.get("/",authenticateUser, controller.fetchAllTasks)

router.get("/:taskId", authenticateUser, controller.getTask);

router.put("/:taskId", authenticateUser, controller.updateTask);

router.delete("/:taskId", authenticateUser, controller.deleteTask);




module.exports=router