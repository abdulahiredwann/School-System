const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const gradeSchema = new Schema({
  name: String,
});

module.exports = mongoose.model("Grade", gradeSchema);
