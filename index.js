// Import needed libraries
const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
require("dotenv").config();

// Configure Server
const app = express(); // Initialize express as an app variable
app.set("port", process.env.PORT || 6969); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors
// Import routes
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/categoriesRoute");
const electionsRoutes = require("./routes/electionsRoute");
const pollscategoryRoutes = require("./routes/pollscategoryRoute");

// Use individual routes when visiting these URLS
app.use("/users", userRoute);
app.use("/categories", productRoute);
app.use("/elections", electionsRoutes);
app.use("/pollscategory", pollscategoryRoutes);

// Set up server to start listening for requests
app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});

app.use(express.static("public"));

// This is where we check URLs and Request methods to create functionality
// GET '/' is always what will be displayed on the home page of your application
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/" + "index.html");
});
