const NotifTokens = require("../models/NotifTokens");

const createUser = async (req, res) => {
  const { client, token } = req.body;

  try {
    const exist = await NotifTokens.findOne({ token });
    if (exist) {
      console.error("Token already exists");
      return res.json({ error: "Token already exists" });
    }
    const newUser = new NotifTokens({ client, token });

    const user = await newUser.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.json({ error: err.message });
  }
};

const getAllClientUsers = async (req, res) => {
  const { client } = req.params;

  try {
    const users = await mongoose.models.NotifTokens.find({ client });

    res.json({ users });
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = { createUser, getAllClientUsers };
