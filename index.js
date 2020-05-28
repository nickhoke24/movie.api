const express = require("express"),
  morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
const Movies = require("./movies");
app.use(morgan("common"));

// get request
app.get("/", function (req, res) {
  res.send("Welcome to myFlix!");
});

// return top 10 movies
app.get("/movies", function (req, res) {
  res.json(Movies);
});

// serve "documentation.html" file from public folder
app.use(express.static("public"));

// morgan middleware to log all requests
app.get("/secreturl", function (req, res) {
  res.send("This is a secret url with super top-secret content.");
});

// Error-handling middleware to log app erros to terminal
app.use(bodyParser.json());
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => console.log("myFlix is listening on port 8080."));