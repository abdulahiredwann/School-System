const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Joi = require("joi");

const teacherSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true, // Ensure username is unique
  },
  password: {
    type: String,
    required: true,
  },
  subject: {
    type: ObjectId,
    ref: "Subject",
    required: true,
  },
});

const Teacher = mongoose.model("Teacher", teacherSchema);

function validateTeacher(teacher) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    username: Joi.string().min(4).max(100).required(),
    password: Joi.string().min(6).max(1024).required(),
    subject: Joi.required(), // Ensure subject is a single ObjectId
  });

  return schema.validate(teacher);
}

module.exports.Teacher = Teacher;
module.exports.validate = validateTeacher;
