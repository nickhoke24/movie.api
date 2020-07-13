import React from "react";
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import { connect } from "react-redux";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { setMovies, setUser } from "../../actions/actions";

import MoviesList from "../movies-list/movies-list";
import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { RegistrationView } from "../registration-view/registration-view";
import { DirectorView } from "../director-view/director-view";
import { GenreView } from "../genre-view/genre-view";
import { ProfileView } from "../profile-view/profile-view";
import { About } from "../header/about";
import { Contact } from "../header/contact";
import { UpdateProfile } from "../update-profile/update-profile";

export class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: [],
      user: null,
      profileInfo: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
      this.getAccount(accessToken);
    }
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie,
    });
  }

  getMovies(token) {
    axios
      .get("https://myflixdbnickhoke.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        this.props.setMovies(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  //return user as set state
  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username,
    });

    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", authData.user.Username);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.setState({
      user: null,
    });
    window.open("/", "_self");
  }

  getAccount(accessToken) {
    const url =
      "https://myflixdbnickhoke.herokuapp.com/users/" +
      localStorage.getItem("user");
    console.log(url);
    axios
      .get(url, {
        headers: { Authorization: "Bearer " + accessToken },
      })
      .then((response) => {
        // console.log(response.data);
        // Assign result to a state
        this.setState({
          profileInfo: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    let { movies } = this.props;
    let { user } = this.state;

    // const { movies, user, profileInfo } = this.state;

    if (!movies) return <div className="main-view" />;

    return (
      <Router basename="/client">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand>
            <h1>My Flix</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {!user ? (
                <ul>
                  <Link to={`/`}>
                    <Button variant="link">login</Button>
                  </Link>
                  <Link to={`/register`}>
                    <Button variant="link">Register</Button>
                  </Link>
                </ul>
              ) : (
                <ul>
                  <Link to={`/`}>
                    <Button variant="link" onClick={() => this.onLoggedOut()}>
                      Log out
                    </Button>
                  </Link>
                  <Link to={`/user/`}>
                    <Button variant="link">Profile</Button>
                  </Link>
                  <Link to={`/`}>
                    <Button variant="link">Movies</Button>
                  </Link>
                  <Link to={`/about`}>
                    <Button variant="link">About</Button>
                  </Link>
                  <Link to={`/contact`}>
                    <Button variant="link">Contact</Button>
                  </Link>
                </ul>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <br></br>
        <div className="main-view">
          <Route
            exact
            path="/"
            render={() => {
              if (!user)
                return (
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                );
              return <MoviesList movies={movies} />;
              // return movies.map((m) => <MovieCard key={m._id} movie={m} />);
            }}
          />
          <Route path="/register" render={() => <RegistrationView />} />
          <Route
            path="/movies/:movieId"
            render={({ match }) => (
              <MovieView
                movie={movies.find((m) => m._id === match.params.movieId)}
              />
            )}
          />
          <Route
            path="/directors/:name"
            render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return (
                <DirectorView
                  director={
                    movies.find((m) => m.Director.Name === match.params.name)
                      .Director
                  }
                />
              );
            }}
          />
          <Route
            path="/genres/:name"
            render={({ match }) => {
              if (!movies) return <div className="main-view" />;
              return (
                <GenreView
                  genre={
                    movies.find((m) => m.Genre.Name === match.params.name).Genre
                  }
                />
              );
            }}
          />
          <Route
            path="/user/"
            render={() => (
              <ProfileView
                user={user}
                profileInfo={this.state.profileInfo}
                movies={movies}
                logOutFunc={() => this.logOut()}
              />
            )}
          />
          <Route
            path="/Update/:name"
            render={() => (
              <UpdateProfile user={user} profileInfo={this.state.profileInfo} />
            )}
          />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
        </div>
      </Router>
    );
  }
}

let mapStateToProps = (state) => {
  return { movies: state.movies };
};

export default connect(mapStateToProps, { setMovies, setUser })(MainView);

// MainView.propTypes = {
//   // so far no props needed
// };

// import Col from "react-bootstrap/Col";
// import Row from "react-bootstrap/Row";
// import Container from "react-bootstrap/Container";
// import PropTypes from "prop-types";
