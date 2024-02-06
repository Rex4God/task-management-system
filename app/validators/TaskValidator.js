"use strict";
const Joi = require("joi");
const{validate} = require("../utils/helpers")

exports.createTask =async(body)=>{
    let schema={
        title: Joi.string().required(),
        description:Joi.string().required()
    }
    return validate(schema, body)
}
exports.updateTask =async(body)=>{
    let schema={
        title: Joi.string().required(),
        description:Joi.string().required()
    }
    return validate(schema, body)
}