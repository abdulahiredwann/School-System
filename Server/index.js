const express = require("express");
const mongoose = require("mongoose");

const subject = require("./router/Subject");
const teacher = require("./router/Teacher");
const grade = require("./router/Grade");
const app = express();

app.use(express.json());

// sudo systemctl start mongodb
mongoose
  .connect("mongodb://127.0.0.1:27017/SMS")
  .then(() => {
    console.log("Connected to db ....");
  })
  .catch((err) => {
    console.log("Could not connect to MongoDb....", err);
  });

app.use("/subject", subject);
app.use("/teacher", teacher);
app.use("/grade", grade);

app.listen(3000, () => {
  console.log("Server is listening ");
});
