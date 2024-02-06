"use strict";
const Joi = require("joi");
const {validate} = require("../utils/helpers")


exports.createUser =async(body)=>{
     let schema ={
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','io','org','ng','edu','uk','it','co'] } }).required(),
        password: Joi.string().required(),
     }
    return validate(schema, body)
}

exports.updateUser =async(body)=>{
     let schema ={
        firstName:Joi.string().required(),
        lastName: Joi.string().required(),
        email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','io','org','ng','edu','uk','it','co'] } }).required(),
     }
     return validate(schema, body)
}

