const cardWebRoute = require("express").Router();
const { addConnection, getProfileCard, userCardCount } = require("../controller/CardWebController");

cardWebRoute.get("/:sid/share", getProfileCard);

cardWebRoute.post("/connection/add", addConnection);

cardWebRoute.post("/user/userCardCount", userCardCount);

module.exports = cardWebRoute;
