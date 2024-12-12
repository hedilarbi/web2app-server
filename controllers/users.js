const Users = require("../models/Users");

const createUser = async (req, res) => {
  const { projectId, token } = req.body;

  try {
    const exist = await Users.findOne({ token });
    if (exist) {
      return res.json({ error: "Token already exists" });
    }
    const newUser = new Users({ projectId, token });

    const user = await newUser.save();

    res.status(201).json(user);
  } catch (err) {
    console.error(err.message);
    res.json({ error: err.message });
  }
};

const getAllClientUsers = async (req, res) => {
  const { projectId } = req.params;

  try {
    const users = await mongoose.models.Users.find({ projectId });

    res.json({ users });
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = { createUser, getAllClientUsers };
