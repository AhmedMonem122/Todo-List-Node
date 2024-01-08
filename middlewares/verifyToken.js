const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader =
    req.headers["Authorization"] || req.headers["authorization"];
  if (!authHeader) {
    const error = AppError.create(
      "You are not logged in, Please login to get access!",
      401,
      "error"
    );
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  try {
    const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = AppError.create("invalid token", 401, "error");
    return next(error);
  }
};

module.exports = verifyToken;
