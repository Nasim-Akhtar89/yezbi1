require("dotenv").config();
const mongoose = require("mongoose");

let dbConnectionVar;
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectToDatabase(app) {
  console.log("DATABASE_URL : ", process.env.DATABASE_URL.slice(0, -1).replace(/^["'](.+(?=["']$))["']$/, "$1"));

  const uri = process.env.DATABASE_URL.replace(";", "").replace(/^["'](.+(?=["']$))["']$/, "$1");
  const port = process.env.DEV_PORT.replace(";", "");
  const PORT = port ? port : 8000;
  try {
    dbConnectionVar = await mongoose.connect(uri, dbOptions);
    console.log("Database Connected...");
    app.listen(PORT);
    console.log("Server Listening either on Port :", PORT);
  } catch (err) {
    console.log("Failed to connect database...");
    console.log("Either worng DATABASE_URL in .env");
    console.log("---------- OR ------------");
    console.log("database service is unavailable (turned off)");
    console.log(err);
  }
}

module.exports = {
  dbConnectionVar,
  connectToDatabase,
};
