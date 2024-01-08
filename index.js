const express = require("express");
const cors = require("cors");
const todosRouter = require("./routes/todosRouter");
const userRouter = require("./routes/userRouter");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/todos", todosRouter);
app.use("/api/v1/users", userRouter);

// global middleware for not found router
app.all("*", (req, res, next) => {
  return res
    .status(404)
    .json({ status: "error", message: "this resource is not available" });
});

// global error handler
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || "error",
    message: error.message,
    code: error.statusCode || 500,
    data: null,
  });
});

module.exports = app;
