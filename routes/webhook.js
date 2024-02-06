"use strict";
const express = require("express");
const router = express.Router();
const controller = require("../app/controllers/WebHookController");


router.post("/", controller.subscribe);

router.delete("/:webHookId", controller.unsubscribe)


module.exports =router