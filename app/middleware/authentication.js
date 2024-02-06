
const { isTokenValid } = require('../utils/jwt');


const authenticateUser = async (req, res, next) => {
  let token;
  // check header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }
  if (!token){
    return res.status(401).json({
      status: false,
      error: "Unauthorized",
      message: "Token has expired or invalid!",
})      
  }
  try {
    const payload = isTokenValid(token);

    req.user = {
      userId: payload.user.userId,
    };
    next();
  } catch (error) { res.status(401).json({
    status: false,
    error: "Unauthorized",
    message: "Token has expired or invalid!",
})
  }
};



module.exports = { authenticateUser };
