const express = require("express");
const todosController = require("../controllers/todosController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.get("/allTodos", todosController.getAllTodos);

router
  .route("/")
  .get(verifyToken, todosController.getUserTodos)
  .post(verifyToken, todosController.addUserTodo);

router
  .route("/:id")
  .patch(verifyToken, todosController.updateUserTodo)
  .delete(verifyToken, todosController.deleteUserTodo);

module.exports = router;
