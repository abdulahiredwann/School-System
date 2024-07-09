const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Joi = require("joi");
const { result } = require("lodash");
const jwt = require("jsonwebtoken");

const resultSchema = new Schema({
  subject: {
    type: ObjectId,
    ref: "Subject",
    required: true,
  },
  exams: {
    midExam1: {
      type: Number,
    },
    midExam2: {
      type: Number,
    },
    finalExam: {
      type: Number,
    },
  },
});
const studentSchema = new Schema({
  studentName: {
    type: String,
    required: true,
  },
  gender: {
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

studentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username },
    process.env.jwtPrivateKey
  );
  return token;
};

const Student = mongoose.model("Student", studentSchema);

function vaildateStudent(student) {
  const schema = Joi.object({
    studentName: Joi.string().required(),
    username: Joi.string().required().min(4).max(100),
    password: Joi.string().required().min(6).max(1024),

    grade: Joi.required(),
    gender: Joi.required(),
  });

  return schema.validate(student);
}

function validateRegisterStudent(student) {
  const schema = Joi.object({
    studentName: Joi.string().required(),
    username: Joi.string().required().min(4).max(100),

    grade: Joi.required(),
    gender: Joi.required(),
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
module.exports.validateRegisterStudent = validateRegisterStudent;

module.exports.Student = Student;
