const { default: Expo } = require("expo-server-sdk");

const { default: mongoose } = require("mongoose");
const fetch = require("node-fetch");
const sendNotifications = async (req, res) => {
  const { title, body, id_notification } = req.body;
  const { projectId } = req.params;

  try {
    if (!title || !body || !id_notification) {
      await fetch(
        `https://web2app.fr/v1/notification/${id_notification}/update?status=error`,
        {
          method: "GET",
        }
      );
      return res
        .status(400)
        .json({ message: "Title and body are required", success: false });
    }
    await fetch(
      `https://web2app.fr/v1/notification/${id_notification}/update?status=progress`,
      {
        method: "GET",
      }
    );
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

    await fetch(
      `https://web2app.fr/v1/notification/${id_notification}/update?status=success`,
      {
        method: "GET",
      }
    );
    res.status(200).json({ message: "Notifications envoye", success: true });
  } catch (err) {
    console.error(err.message);
    await fetch(
      `https://web2app.fr/v1/notification/${id_notification}/update?status=error`,
      {
        method: "GET",
      }
    );
    res.status(500).json({ message: err.message, success: false });
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
