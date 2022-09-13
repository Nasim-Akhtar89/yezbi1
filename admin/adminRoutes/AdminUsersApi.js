const AdminUsersRoute = require("express").Router();

const { getAllUsers, getUsersCsvData } = require("../adminController/AdminUserController");

AdminUsersRoute.post("/admin/getAllUsers", getAllUsers);
AdminUsersRoute.get("/admin/getUsersCsvData", getUsersCsvData);

module.exports = AdminUsersRoute;
