const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Joi = require("joi");
const { result } = require("lodash");

const resultSchema = new Schema({
  subject: {
    type: ObjectId,
    ref: "Subject",
  },
});
const studentSchema = new Schema({
  studentName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  grade: {
    type: ObjectId,
    ref: "Grade",
  },
  results: [resultSchema],
});
const Student = mongoose.model("Student", studentSchema);

function vaildateStudent(student) {
  const schema = Joi.object({
    studentName: Joi.string().required(),
    username: Joi.string().required().min(4).max(100),
    password: Joi.string().required().min(6).max(1024),
    grade: Joi.required(),
    results: Joi.array()
      .items(
        Joi.object({
          subject: Joi.string().optional(),
        })
      )
      .optional(),
  });

  return schema.validate(student);
}

function validateStudentUpdate(student) {
  const schema = Joi.object({
    studentName: Joi.string().required(),
    username: Joi.string().required().min(4).max(100),
    password: Joi.string().required().min(6).max(1024),
  });

  return schema.validate(student);
}

module.exports.validate = vaildateStudent;
module.exports.validateUpdate = validateStudentUpdate;

module.exports.Student = Student;
