const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");

const subjectSchema = new Schema({
  subject: {
    type: String,
    required: true,
    unique: true, // Add unique constraint if subjects should be unique
  },
});

const Subject = mongoose.model("Subject", subjectSchema);

function validateSubject(subject) {
  const schema = Joi.object({
    subject: Joi.string().required(),
  });

  return schema.validate(subject);
}

// Export both the model and the validation function
exports.Subject = Subject;
exports.validate = validateSubject;
