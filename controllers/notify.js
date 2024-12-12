const { default: Expo } = require("expo-server-sdk");

const { default: mongoose } = require("mongoose");
const sendNotifications = async (req, res) => {
  const { title, body } = req.body;
  console.log(req.body);
  const { projectId } = req.params;

  try {
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required" });
    }
    let messages = [];
    let expo = new Expo();
    const users = await mongoose.models.Users.find({ projectId });

    const usersTokens = users.map((user) => user.token || "");
    for (let pushToken of usersTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        return { error: `invalid notification token` };
      }

      messages.push({
        to: pushToken,
        sound: "default",
        channel: "default",
        body,
        title,
        priority: "high",
      });
    }
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

      tickets.push(...ticketChunk);
    }

    res.status(200).json({ message: "Notifications envoye" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

const sendNotificationsForOne = async (req, res) => {
  const { title, body, pushToken } = req.body;

  try {
    let expo = new Expo();

    if (!Expo.isExpoPushToken(pushToken)) {
      return { error: `invalid notification token` };
    }

    const message = {
      to: pushToken,
      sound: "default",
      body,
      title,
    };

    let ticketChunk = await expo.sendPushNotificationsAsync([message]);

    res.json({ ticketChunk });
  } catch (err) {
    res.json({ error: err.message });
  }
};

module.exports = { sendNotifications, sendNotificationsForOne };
