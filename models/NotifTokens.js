const { Schema, model } = require("mongoose");
const categorySchema = new Schema({
  token: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
});

module.exports = model("NotifTokens", categorySchema);
