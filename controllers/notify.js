const { default: Expo } = require("expo-server-sdk");
const { default: mongoose } = require("mongoose");
const sendNotifications = async (title, body, client) => {
  try {
    let messages = [];
    let expo = new Expo();
    const users = await mongoose.models.NotifTokens.find({ client });
    const usersTokens = users.map((user) => user.token || "");
    for (let pushToken of usersTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        return { error: `invalid notification token` };
      }

      messages.push({
        to: pushToken,
        sound: "default",
        body,
        title,
      });
    }
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);

      tickets.push(...ticketChunk);
    }
  } catch (err) {
    return { error: err.message };
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
