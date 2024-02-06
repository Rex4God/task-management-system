"use strict";
const Joi = require("joi");
const {validate} = require("../utils/helpers");


exports.subcribe =async(body)=>{
    let schema ={
        url:Joi.string().uri().required()
    }
    return validate(schema, body)
}