const express = require("express"),
  morgan = require("morgan");
const app = express();
const bodyParser = require("body-parser");
// const Movies = require("./movies");
// const Users = require("./users");
app.use(morgan("common"));
app.use(express.static("public"));
app.use(bodyParser.json());
const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models.js");
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect("mongodb://localhost:27017/myFlixDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const passport = require('passport');
require('./passport');
let auth = require('./auth')(app);

// general get request
app.get("/", function (req, res) {
  res.send("Welcome to myFlix!");
});

// Return all movies
app.get("/movies", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.find().then((movies) => res.json(movies));
});

// Return single movie by title
app.get('/movies/:Title', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
      Title: req.params.Title
    })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return Genre by Name
app.get('/movies/genres/:Name', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
      'Genre.Name': req.params.Name
    })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return Director by Name
app.get("/movies/director/:Name", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
      'Director.Name': req.params.Name
    })
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

app.get("/users", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.find().then((users) => res.json(users));
});

app.get("/users/:Username", (req, res) => {
  res.json(
    users.find((user) => {
      return user.Username === req.params.Username;
    })
  );
});

// Allow new user to register
app.post('/users', (req, res) => {
  Users.findOne({
      Username: req.body.Username
    })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users.create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Allow user to update info
app.put('/users/:Username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }, {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//allows user to add movie from favorites
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $push: {
        FavoriteMovies: req.params.MovieID
      }
    }, {
      new: true
    },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

//allows user to remove movie from favorites
app.delete("/users/:Username/Movies/:MovieID", passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $pull: {
        FavoriteMovies: req.params.MovieID
      }
    }, {
      new: true
    },
    (error, updatedUser) => {
      if (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      } else {
        res.json(updatedUser);
      }
    }
  );
});

//allows user to deregister
app.delete('/users/:Username', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Users.findOneAndRemove({
      Username: req.params.Username
    })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// morgan middleware to log all requests
app.get("/secreturl", function (req, res) {
  res.send("This is a secret url with super top-secret content.");
});

// Error-handling middleware to log app erros to terminal
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// listen for requests
app.listen(8080, () => console.log("myFlix is listening on port 8080."));