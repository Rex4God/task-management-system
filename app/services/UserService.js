"use strict";
const {StatusCodes} = require("http-status-codes")
const userRepository = require("../repositories/UserRepository")
const userValidator = require("../validators/UserValidator")
const {resolveRequestQueryToMongoDBQuery} = require("../utils/helpers");
const {createJWT} = require("../utils/jwt")
const logger = require("../utils/logger")

const log = logger()



exports.createUser =async( body, options)=>{
   try{
    const validatorError = await userValidator.createUser(body);
    if(validatorError) return{
        error: validatorError,
        statusCode:StatusCodes.UNPROCESSABLE_ENTITY
    }
    const { email } = body

    const alreadyExistsUser = await userRepository.findOne({ email }).catch(
      (err) => {
        log.error("Error: ", err);
      });

    if (alreadyExistsUser) return {
      error: "User already exist in the database",
      statusCode: StatusCodes.CONFLICT
    }

  const user = await userRepository.create({
     firstName:body.firstName,
     lastName:body.lastName,
     email:body.email,
     password:body.password,
  })

 const token = await createJWT({payload:{user},options})
 return{
  data:{
   user:{
      firstName:user.firstName,
      lastName:user.lastName,
      email: user.email,
      userId: user._id, 
      
   },
   token
  },
statusCode: StatusCodes.CREATED,
}
}catch(e){
  log.error("An unknown error has occurred. Please try again later" +e);
  return{
    error:e.message,
    statusCode: StatusCodes.CREATED
  };
  }
};

exports.login =async(body, options)=>{
     try{

  const{email, password} =body
  if (!email || !password) return{
      error:  "Please provide your email and password",
      statusCode: StatusCodes.BAD_REQUEST
  }
  const user = await userRepository.findOne({ email })
  if (!user) return{
      error:  "Invalid Credential",
      statusCode: StatusCodes.BAD_REQUEST
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched ) return{
      error: "Invalid Credential",
      statusCode: StatusCodes.BAD_REQUEST
  }
  const token = await createJWT({payload:{user},options})
  return{
      data:{
       user:{
          firstName:user.firstName,
          lastName:user.lastName,
          email: user.email,
          userId: user._id, 
       },
       token
      },
    statusCode: StatusCodes.OK,
  }
}catch(e){
 log.error("An unknown error has occurred. Please try again later"+e);
 return{
  error:e.message,
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR
 }
 }
};
 
exports.getUser =async(userId)=>{
  try{
  let user = await userRepository.findOne({
  _id: userId
  })
  if(!user) 
  return {
      error: "Oops! We could not find this  user on this platform.",
      statusCode: StatusCodes.NOT_FOUND
  };
  return{
    data:{
     user:{
        firstName:user.firstName,
        lastName:user.lastName,
        email: user.email,
        userId: user._id, 
     },
     statusCode: StatusCodes.OK,
    }
  
}
}catch(e){
  log.error("An unknown error has occurred. Please try again later"+e);;
  return{
    error:e.message,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
  };
   }
};
        
exports.fetchUsers =async(requestParams)=>{
  try{
  const mongodbQuery = await resolveRequestQueryToMongoDBQuery(requestParams);

  const users = await userRepository
  .all(mongodbQuery.filter, mongodbQuery.sort, mongodbQuery.page, mongodbQuery.limit);

  return {
      data: users ,
      statusCode: StatusCodes.OK
  }
}catch(e){
  log.error("An unknown error has occurred. Please try again later"+e);;
  return{
    error: e.message,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
  }
}
};

exports.updateUser = async(body,userId)=>{
try{
const validatorError = await userValidator.updateUser(body);
if(validatorError)return{
  error: validatorError,
  statusCode: StatusCodes.UNPROCESSABLE_ENTITY
}
let user  = await userRepository.findOne({_id: userId});
if(!user)return{
  error: "Oops! This user detail is not found on the platform",
  statusCode: StatusCodes.NOT_FOUND
}
const update ={
  firstName:body.firstName || user.firstName,
  lastName:body.lastName || user.lastName,
  email:body.email || user.email,
}
await userRepository.update({_id: userId}, update)

return{
  data:userId,
  statusCode: StatusCodes.OK
}

}catch(e){
  log.error("An unknown error has occurred. Please try again later"+e);
  return{
  error: e.message,
  statusCode: StatusCodes.INTERNAL_SERVER_ERROR
  };
}
};

exports.deleteUser = async (userId) => {
 try{
let user = await userRepository.findOne({
    _id: userId
  });
  
  if(!user) return{
    error:"Oop!This  user could not be found on this platform",
    statusCode:StatusCodes.NOT_FOUND
  }
   
   
    await userRepository.deleteMany({
        _id: userId,
    });

    return {
        data: userId,
        statusCode: StatusCodes.OK
    };
 }catch(e){
  log.error("An unknown error has occurred. Please try again later"+e);
  return{
    error: e.message,
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR
  };
  }
 };
   