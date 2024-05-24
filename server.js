const mongoose = require("mongoose");
const app = require("./index");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

const DB = process.env.DATABASE_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

db.collection.dropIndexes();

mongoose
  .connect(DB)
  .then(() => console.log("Database connected successfully!"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App Running on port ${port}...`);
});
