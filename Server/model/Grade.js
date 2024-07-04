const Joi = require("joi");
const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const gradeSchema = new Schema({
  gradeName: {
    type: String,
    required: true,
  },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

const Grade = mongoose.model("Grade", gradeSchema);

function vaildateGrade(grade) {
  const schema = Joi.object({
    gradeName: Joi.string().required(),
    teachers: Joi.array().items(Joi.string().optional()).optional(),
    students: Joi.array().items(Joi.string().optional()).optional(),
  });

  return schema.validate(grade);
}

function validateUpdate(grade) {
  const schema = Joi.object({
    gradeName: Joi.string().required(),
  });

  return schema.validate(grade);
}

module.exports.validate = vaildateGrade;
module.exports.validateUpdate = validateUpdate;
module.exports.Grade = Grade;
