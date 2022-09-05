require("dotenv").config();
const mongoose = require("mongoose");

let dbConnectionVar;
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectToDatabase(app) {
  console.log("dburi : ", process.env.DBURI.slice(0, -1).replace(/^["'](.+(?=["']$))["']$/, "$1"));

  const uri = process.env.DBURI.replace(";", "").replace(/^["'](.+(?=["']$))["']$/, "$1");
  const port = process.env.DEV_PORT.replace(";", "");
  try {
    dbConnectionVar = await mongoose.connect(uri, dbOptions);
    console.log("Database Connected...");
    app.listen(8000 || port);
    console.log("Server Listening either on Port :" + port + "     " + 8000);
  } catch (err) {
    console.log("Failed to connect database...");
    console.log("Either worng dbUri in .env");
    console.log("---------- OR ------------");
    console.log("database service is unavailable (turned off)");
    console.log(err);
  }
}

module.exports = {
  dbConnectionVar,
  connectToDatabase,
};
