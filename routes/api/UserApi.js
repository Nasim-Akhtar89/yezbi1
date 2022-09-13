const userRoute = require("express").Router();
const { userSignUp, userSignIn } = require("../../controller/UserController");

userRoute.post("/user/signUp", userSignUp);
userRoute.post("/user/login", userSignIn);

module.exports = userRoute;
