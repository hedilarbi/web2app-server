const express = require("express");
const {
  sendNotifications,
  sendNotificationsForOne,
} = require("../controllers/notify");
const router = express.Router();

router.post("/:client", sendNotifications);
router.post("/one", sendNotificationsForOne);

module.exports = router;
