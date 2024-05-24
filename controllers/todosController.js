const Todo = require("../models/todosModel");
const catchAsync = require("../middlewares/catchAsync");
const AppError = require("../utils/appError");

const getAllTodos = catchAsync(async (req, res, next) => {
  const todos = await Todo.find({}, { __v: false });

  res.status(200).json({
    status: "success",
    results: todos.length,
    data: {
      todos,
    },
  });
});

const getUserTodos = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;

  const todos = await Todo.find({ createdBy: id }, { __v: false });

  res.status(200).json({
    status: "success",
    results: todos.length,
    data: {
      todos,
    },
  });
});

const addUserTodo = catchAsync(async (req, res, next) => {
  const { id } = req.currentUser;
  const newTodo = await Todo.create(
    { ...req.body, createdBy: id },
    { validateBeforeSave: false }
  );

  res.status(201).json({
    status: "success",
    data: {
      todo: newTodo,
    },
  });
});

const updateUserTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { title, completed } = req.body;
  const { id: userId } = req.currentUser;

  const todo = await Todo.findById(id);

  if (!todo) {
    const error = AppError.create("Todo not found!", 404, "fail");
    return next(error);
  }

  if (todo.createdBy !== userId) {
    const error = AppError.create(
      "This todo is not related to this account!",
      401,
      "fail"
    );
    return next(error);
  }

  if (!title) {
    const error = AppError.create("Title is required!", 400, "fail");
    return next(error);
  }

  if (typeof completed === "boolean") {
    todo.completed = completed;
  }

  todo.title = title;
  if (!completed && typeof completed !== "boolean") {
    todo.completed = todo.completed;
  }
  todo.updatedAt = Date.now();

  todo.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: {
      todo,
    },
  });
});

const deleteUserTodo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { id: userId } = req.currentUser;

  const todo = await Todo.findById(id);

  if (!todo) {
    const error = AppError.create("Todo not found!", 404, "fail");
    return next(error);
  }

  if (todo.createdBy !== userId) {
    const error = AppError.create(
      "This todo is not related to this account!",
      401,
      "fail"
    );
    return next(error);
  }

  await todo.deleteOne();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  getAllTodos,
  getUserTodos,
  addUserTodo,
  updateUserTodo,
  deleteUserTodo,
};
