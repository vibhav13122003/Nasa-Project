const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const planetsRouter = require("./routes/planets/planets.router");
const launchesRouter = require("./routes/launches/launches.router");
const app = express();

// Enable CORS for development
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Enable request logging
app.use(morgan("combined"));

// Parse JSON requests
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

// Catch-all route to serve the client's HTML file
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
