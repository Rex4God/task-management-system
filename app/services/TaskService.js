"use strict";
const taskValidator = require("../validators/TaskValidator")
const {StatusCodes} = require("http-status-codes")
const taskRepository = require("../repositories/TaskRepository")
const{resolveRequestQueryToMongoDBQuery} = require("../utils/helpers")
const logger = require("../utils/logger")
const {sendTaskToQueue } = require("../../lib/queue")
const{QUEUE} =require("../utils/constants")
const webHookRepository = require("../repositories/WebHookRepository")
const webHookServices = require("../../services/WebhookService")

const log = logger()


exports.createTask=async(body)=>{
    try{
    const validatorError = await taskValidator.createTask(body);
    if(validatorError){
         return{
        error:validatorError,
        statusCode:StatusCodes.UNPROCESSABLE_ENTITY
       }
    }
    const task = await taskRepository.create({
         title:body.title,
         description:body.description,
    })

 
 await sendTaskToQueue (task.toString())
 
 const webhooks = await webHookRepository.all({})
 await webHookServices.notifyWebhooks(webhooks, {
   event: QUEUE.TASK.CREATED,
   data: task,
 });
return{
    data: task,
    statusCode: StatusCodes.CREATED
};

}catch(e){
  log.error("An unknown error has occurred. Please try again later"+e);
    return{
        error:e.message,
        statCode:StatusCodes.INTERNAL_SERVER_ERROR
    };
  }
};

exports.fetchAllTasks =async(requestParams)=>{
     try{
        
    const mongodbQuery = await resolveRequestQueryToMongoDBQuery(requestParams);

    const tasks = await taskRepository
    .all(mongodbQuery.filter, mongodbQuery.sort, mongodbQuery.page, mongodbQuery.limit);

    return {
        data: tasks,
        statusCode: StatusCodes.OK
    };

    }catch(e){
     log.error("An unknown error has occurred. Please try again later"+e);;
    return{
        error:e.message,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    };
    }
};

exports.getTask =async(taskId)=>{
    try{
    const task = await taskRepository.findOne({_id: taskId});

    if(!task){
    return{
     error: "Oops! This task is not found on the platform",
     statusCode: StatusCodes.NOT_FOUND
    }
    };

    return{
      data: task,
      statusCode: StatusCodes.OK
    }

    }catch(e){
      log.error("An unknown error has occurred. Please try again later"+e);;
     return{
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
     }
    }
}

exports.updateTask =async(body, taskId)=>{
     try{
     const validatorError = await taskValidator.updateTask(body);

     if(validatorError){
        return{
           error: validatorError,
           statusCode: StatusCodes.UNPROCESSABLE_ENTITY
        }
     }
     const task = await taskRepository.findOne({_id: taskId})
     

     if(!task){
        return{
          error: "Oops! This task is not found on this platform",
          statusCode: StatusCodes.NOT_FOUND
        }
     }

     const update ={
         title:body.title || task.title,
         description:body.description || task.description
     }

     await taskRepository.update({_id: taskId}, update);

     await sendTaskToQueue(task.toString())

    const webhooks = await webHookRepository.all({})
    await webHookServices.notifyWebhooks(webhooks, {
    event: QUEUE.TASK.UPDATED,
    data: task,
    });

     return{
        data: task,
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

exports.deleteTask = async(taskId)=>{
    try{
     const task = await taskRepository.findOne({_id: taskId});
     if(!task){
        return{
         error: "Oops! This task is not found on the platform.Hence it cannot be deleted",
         statusCode: StatusCodes.NOT_FOUND
        }
     }
     await taskRepository.deleteMany({_id: taskId});

     await sendTaskToQueue(task.toString())

    const webhooks = await webHookRepository.all({})
    await webHookServices.notifyWebhooks(webhooks, {
    event: QUEUE.TASK.DELETED,
    data: task,
    });

     return{
      data: taskId,
      statusCode: StatusCodes.OK
     }

    }catch(e){
      log.error("An unknown error has occurred. Please try again later"+e);;
     return{
      error: e.message,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR
     }
    }
}



