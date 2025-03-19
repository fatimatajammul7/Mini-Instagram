const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated. No token provided." });
  }

  const token = authHeader.split(' ')[1]; 
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'somesupersecretsecret');
  } catch (err) {
    return res.status(500).json({ message: "Failed to authenticate token.", error: err });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: "Not authenticated. Invalid token." });
  }

  req.userId = decodedToken.userId;
  console.log("Authenticated user ID:", req.userId);
  
  next();
};
