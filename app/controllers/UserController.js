"use strict";
const userService= require("../services/UserService");
const response = require("../utils/responses");


exports.createUser =async(req, res)=>{
     const{
        error,
        data,
        statusCode
     } = await userService.createUser(req.body);

     if(error) return response.error(res, error, statusCode);

     return response.success(res, data, statusCode)
};

exports.login = async(req, res)=>{
    const{
        error,
        data,
        statusCode
        } = await userService.login(req.body);

        if(error) return response.error(res, error, statusCode);

        return response.success(res, data, statusCode)
}

exports.forgotPassword = async (req, res) => {
    const {
        error,
        statusCode,
        data
    } = await userService.forgotPassword(req.body);

    if (error) return response.error(res, error, statusCode);

    return response.success(res, data, statusCode);
};
exports.resetPassword = async (req, res) => {
    const {
        error,
        statusCode,
        data
    } = await userService.resetPassword(req.body,req.params.userId, req.params.token);

    if (error) return response.error(res, error, statusCode);

    return response.success(res, data, statusCode);
};

exports.updatePassword =async(req, res)=>{
    const{
        error,
        data,
        statusCode
      } = await userService.updatePassword(req.body, req.params.userId);

      if(error) return response.error(res, error, statusCode);

      return response.success(res, data, statusCode);
    }
exports.fetchUsers =async(req, res)=>{
    const{
    error,
    data,
    statusCode
    } = await userService.fetchUsers(req. query)

    if(error) return response.error(res, error, statusCode)

    return response.paginated(res, data, statusCode)

};

exports.getUser =async(req, res)=>{
const{
    error,
    data,
    statusCode
    } = await userService.getUser(req.params.userId)

    if(error) return response.error(res, error, statusCode)

    return response.success(res,data, statusCode )
};

exports.updateUser =async(req, res)=>{
const{
    error,
    data,
    statusCode
    } = await userService.updateUser(req.body,req.params.userId)

    if(error) return response.error(res, error, statusCode)

    return response.success(res,data, statusCode )
}

exports.deleteUser = async (req, res) => {
    const {
        data,
        error,
        statusCode
    } = await userService.deleteUser(req.params.userId);

    if (error) return response.error(res, error, statusCode);

    return response.success(res, data, statusCode);
};

