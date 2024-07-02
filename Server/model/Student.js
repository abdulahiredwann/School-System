const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const resultSchema = new Schema({
  subject: {
    type: ObjectId,
    ref: "Subject",
  },
});
const studentSchema = new Schema({
  name: {
    type: String,
    requied: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    requied: true,
  },
  grade: {
    type: ObjectId,
    ref: "Grade",
  },
  results: [resultSchema],
});

module.exports = mongoose.model("Student", studentSchema);
