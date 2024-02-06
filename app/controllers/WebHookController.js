"use strict";
const webHookService = require("../services/WebHookService");
const response = require("../utils/responses")


exports.subscribe =async(req, res)=>{
     const{
        error,
        data,
        statusCode
        } = await webHookService.subscribe(req.body);

        if(error) return response.error(res, error, statusCode);

        return response.success(res, data, statusCode)
}

exports.unsubscribe =async(req, res)=>{
     const{
        error,
        data,
        statusCode
        } =await webHookService.unsubcribe(req.params.webHookId);

        if(error) return response.error(res, error, statusCode);

        return response.success(res, data, statusCode)
}