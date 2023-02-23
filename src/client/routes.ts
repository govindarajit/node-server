import * as taskManagementController from "./controllers/taskManagement";

const routes = require("express").Router();

 
/**
 * User routes
 */
// routes.get("/user/list", auth, allow([UserRoles.SuperAdmin]), userController.getUsers);
routes.post("/api/tasks", taskManagementController.addTask);
routes.get("/api/tasks",  taskManagementController.getTask); 
routes.delete("/api/tasks/:id",   taskManagementController.deleteTask);
routes.put("/api/tasks/:id", taskManagementController.updateTask);




module.exports = routes;
