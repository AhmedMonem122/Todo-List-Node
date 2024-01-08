const catchAsync = require("../middlewares/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = catchAsync(async (req, res, next) => {
  // get all courses) from DB using Course Model
  const users = await User.find({}, { __v: false, password: false });

  res.json({ status: "success", results: users.length, data: { users } });
});

const register = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    const error = AppError.create(
      "Your name, email or password are required!",
      400,
      "fail"
    );
    return next(error);
  }

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    const error = AppError.create("user already exists", 400, "fail");
    return next(error);
  }

  // password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  // generate JWT token
  const token = await generateJWT({
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    id: newUser._id,
  });
  newUser.token = token;

  await newUser.save();

  res.status(201).json({ status: "success", data: { user: newUser } });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = AppError.create(
      "email and password are required",
      400,
      "fail"
    );
    return next(error);
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = AppError.create("user not found", 404, "fail");
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);

  if (user && matchedPassword) {
    // logged in successfully

    const token = await generateJWT({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user._id,
    });

    return res.json({ status: "success", data: { token } });
  } else {
    const error = AppError.create("Email or Password are wrong!", 500, "error");
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
