import React from "react";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import PropTypes from "prop-types";

import { BrowserRouter as Router, Route } from "react-router-dom";

import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { RegistrationView } from "../registration-view/registration-view";

export class MainView extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: [],
      user: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem("token");
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem("user"),
      });
      this.getMovies(accessToken);
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
        // Assign the result to the state
        this.setState({
          movies: response.data,
        });
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

  render() {
    const { movies, user } = this.state;

    if (!movies) return <div className="main-view" />;

    return (
      <Router>
        <div className="main-view">
          <Route
            exact
            path="/"
            render={() => {
              if (!user)
                return (
                  <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />
                );
              return movies.map((m) => <MovieCard key={m._id} movie={m} />);
            }}
          />
          <Route path="/register" render={() => <RegistrationView />} />{" "}
          <Route
            path="/movies/:movieId"
            render={({ match }) => (
              <MovieView
                movie={movies.find((m) => m._id === match.params.movieId)}
              />
            )}
          />
        </div>
      </Router>
    );
  }
}

MainView.propTypes = {
  // so far no props needed
};

// onBackClick() {
//   this.setState({
//     selectedMovie: null,
//   });
// }

// This overrides the render() method of the superclass
// No need to call super() though, as it does nothing by default
//   render() {
//     // If the state isn't initialized, this will throw on runtime
//     // before the data is initially loaded
//     const { movies, selectedMovie, user } = this.state;

//     if (!user)
//       return <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />;

//     // Before the movies have been loaded
//     if (!movies) return <div className="main-view" />;

//     return (
//       <div className="main-view">
//         {selectedMovie ? (
//           <MovieView
//             movie={selectedMovie}
//             onBackClick={() => this.onBackClick()}
//           />
//         ) : (
//           movies.map((movie) => (
//             <Container>
//               <Row>
//                 <Col>
//                   <MovieCard
//                     key={movie._id}
//                     movie={movie}
//                     onClick={(movie) => this.onMovieClick(movie)}
//                   />
//                 </Col>
//               </Row>
//             </Container>
//           ))
//         )}
//       </div>
//     );
//   }
// }
