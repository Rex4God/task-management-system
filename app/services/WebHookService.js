"use strict";
const{StatusCodes} = require("http-status-codes")
const logger = require("../utils/logger")
const webHookRepository = require("../repositories/WebHookRepository");
const webHookValidator = require("../validators/WebHookValidator")

const log = logger()


exports.subscribe =async(body)=>{
  try{
   const validatorError =  await webHookValidator.subcribe(body);
   if(validatorError){
    return{
      error:validatorError,
      statusCode: StatusCodes.UNPROCESSABLE_ENTITY
    }
   }

   const webHook = await webHookRepository.create({
    url:body.url,
   })

   return{
    data: webHook,
    statusCode: StatusCodes.CREATED
   }

  }catch(e){
    log.error("An unknown error has occurred. Please try again later"+e);
    return{
      error:e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    }
  }
}

exports.unsubcribe =async(webHookId)=>{
  try{
 const webHook = await webHookRepository.findOne({_id:webHookId});
  if(!webHook){
    return{
     error: "Oops! This webhook is not found",
     statusCode: StatusCodes.NOT_FOUND,
    }
  }
  await webHookRepository.deleteMany({_id: webHookId})
  return{
    data: webHookId,
    statusCode: StatusCodes.OK
  }
  }catch(e){
    log.error("An unknown error has occurred. Please try again later"+e);;
    return{
      error:e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    }
  }
}








