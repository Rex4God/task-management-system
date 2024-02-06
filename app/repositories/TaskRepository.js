"use strict";
const Model = require("../models/TaskModel")
const Repository = require("./MongoDBRepository")

class TaskRepository extends Repository{
    constructor(){
        super(Model);
    }
}
module.exports =(new TaskRepository());