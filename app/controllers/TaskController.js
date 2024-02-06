"use strict"
const response = require("../utils/responses");
const taskService = require("../services/TaskService")


exports.createTask =async(req, res)=>{
     const{
        error,
        data,
        statusCode
        }= await taskService.createTask(req.body);

        if(error) return response.error(res, error, statusCode);

        return response.success(res, data, statusCode);
};

exports.fetchAllTasks = async(req, res)=>{
   const{
      error,
      data,
      statusCode
       } = await taskService.fetchAllTasks(req.query);

       if(error) return response.error(res, error, statusCode);

       return response.paginated(res, data, statusCode);
}

exports.getTask =async(req, res)=>{
     const{
        error,
        data,
        statusCode
        } = await taskService.getTask(req.params.taskId);

        if(error) return response.error(res, error, statusCode);

        return response.success(res, data, statusCode);
};

exports.updateTask =async(req, res)=>{
     const{
        error,
        data,
        statusCode
        } = await taskService.updateTask(req.body,req.params.taskId);

        if(error) return response.error(res, error, statusCode);

        return response.success(res, data, statusCode);
};

exports.deleteTask =async(req, res)=>{
     const{
        error,
        data,
        statusCode
        } = await taskService.deleteTask(req.params.taskId);

        if(error) return response.error(res, error, statusCode);

        return response.success(res, data, statusCode);
};

