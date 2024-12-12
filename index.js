const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const notifyRoutes = require("./routes/notify");
const usersRoutes = require("./routes/users");
const path = require("path");
require("dotenv/config");

const { createServer } = require("http");

const app = express();
const httpServer = createServer(app);

app.use(cors());

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "form.html"));
});

app.use("/api/notify", notifyRoutes);
app.use("/api/users", usersRoutes);

if (process.env.NODE_ENV === "production") {
  mongoose.connect(process.env.DEV_DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  // Event listeners for connection
  db.on("connected", () => {
    console.log("Connected to MongoDB successfully");
  });

  db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  db.on("disconnected", () => {
    console.log("Disconnected from MongoDB");
  });
} else {
  mongoose.connect(
    process.env.DEV_DB_CONNECTION,

    { useNewUrlParser: true }
  );
}

httpServer.listen(process.env.PORT, () => {
  console.log("listening on port 5000");
});
