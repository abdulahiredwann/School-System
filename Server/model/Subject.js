const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const ObjectId = Schema.Types.ObjectId;

const SubjectSchema = new Schema({
  subjectName: {
    type: String,
    required: true,
    unique: true, // Add unique index
  },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
});
const Subject = mongoose.model("Subject", SubjectSchema);

function validateSubject(subject) {
  const schema = Joi.object({
    subjectName: Joi.string()
      .pattern(/^[A-Za-z\s]+$/)
      .required()
      .messages({
        "string.pattern.base":
          "Subject name must contain letters and spaces only",
      }),
  });

  return schema.validate(subject);
}

// Export both the model and the validation function
exports.Subject = Subject;
exports.validate = validateSubject;
