"use strict";
const Model = require("../models/WebHookModel");
const Repository = require("./MongoDBRepository");

class WebHookRepository extends Repository {
    constructor() {
        super(Model);
    }
}

module.exports = (new WebHookRepository());
