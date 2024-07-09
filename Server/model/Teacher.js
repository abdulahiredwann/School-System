const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const teacherSchema = new Schema({
  teacherName: {
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
  grades: [
    {
      type: Schema.Types.ObjectId,
      ref: "Grade",
    },
  ],
  subject: [
    {
      type: ObjectId,
      ref: "Subject",
      required: true,
    },
  ],
});

teacherSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, username: this.username, teacherName: this.teacherName },
    process.env.jwtPrivateKey
  );
  return token;
};

const Teacher = mongoose.model("Teacher", teacherSchema);

function validateTeacher(teacher) {
  const schema = Joi.object({
    teacherName: Joi.string().min(3).max(100).required(),
    username: Joi.string().min(4).max(100).required(),
    password: Joi.string().min(6).max(1024).required(),
    subject: Joi.optional(),
    grades: Joi.optional(),
  });

  return schema.validate(teacher);
}
function validateRegisterTeacher(teacher) {
  const schema = Joi.object({
    teacherName: Joi.string().min(3).max(100).required(),
    username: Joi.string().min(4).max(100).required(),
    subject: Joi.optional(),
    grades: Joi.optional(),
  });

  return schema.validate(teacher);
}

module.exports.Teacher = Teacher;
module.exports.validate = validateTeacher;
module.exports.validateRegisterTeacher = validateRegisterTeacher;
