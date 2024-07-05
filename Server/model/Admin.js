const Joi = require("joi");
const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const jwt = require("jsonwebtoken");
const adminschema = new Schema({
  name: {
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
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

adminschema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.jwtPrivateKey,
    {
      expiresIn: "1h",
    }
  );
  return token;
};

const Admin = mongoose.model("Admin", adminschema);

function validateAdmin(admin) {
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(8).max(1024).required(),
    username: Joi.string().min(4).max(50),
  });

  return schema.validate(admin);
}

module.exports.validate = validateAdmin;
module.exports.Admin = Admin;
