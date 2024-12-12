const { Schema, model } = require("mongoose");
const userSchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
});

module.exports = model("Users", userSchema);
