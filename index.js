const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const notifyRoutes = require("./routes/notify");
const notifyTokensRoutes = require("./routes/notifyTokens");
const path = require("path");
require("dotenv/config");

const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);

app.use(cors());

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

app.use("/api/notify", notifyRoutes);
app.use("/api/notifyTokens", notifyTokensRoutes);

mongoose.connect(
  process.env.DEV_DB_CONNECTION,

  { useNewUrlParser: true }
);

httpServer.listen(process.env.PORT, () => {
  console.log("listening on port 5000");
});
