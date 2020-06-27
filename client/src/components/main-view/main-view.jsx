// import React from "react";
// import axios from "axios";

// import { MovieCard } from "../movie-card/movie-card";
// import { MovieView } from "../movie-view/movie-view";

// export class MainView extends React.Component {
//   constructor() {
//     super();

//     this.state = {
//       movies: null,
//       selectedMovie: null,
//     };
//   }
//   // One of the "hooks" available in a React Component
//   componentDidMount() {
//     axios
//       .get("https://myflixdbnickhoke.herokuapp.com/movies")
//       .then((response) => {
//         // Assign the result to the state
//         this.setState({
//           movies: response.data,
//         });
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }

//   onMovieClick(movie) {
//     this.setState({
//       selectedMovie: movie,
//     });
//   }

//   render() {
//     const { movies, selectedMovie } = this.state;

//     // Before the movies have been loaded
//     if (!movies) return <div className="main-view" />;

//     return (
//       <div className="main-view">
//         {selectedMovie ? (
//           <MovieView movie={selectedMovie} />
//         ) : (
//           movies.map((movie) => (
//             <MovieCard
//               key={movie._id}
//               movie={movie}
//               onClick={(movie) => this.onMovieClick(movie)}
//             />
//           ))
//         )}
//       </div>
//     );
//   }
// }

import React from "react";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import { LoginView } from "../login-view/login-view";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { RegistrationView } from "../registration-view/registration-view";

export class MainView extends React.Component {
  constructor() {
    // Call the superclass constructor
    // so React can initialize it
    super();

    // Initialize the state to an empty object so we can destructure it later
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null,
    };
  }

  componentDidMount() {
    axios
      .get("https://myflixdbnickhoke.herokuapp.com/movies")
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

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie,
    });
  }

  //return user as set state
  onLoggedIn(user) {
    this.setState({
      user,
    });
  }

  // This overrides the render() method of the superclass
  // No need to call super() though, as it does nothing by default
  render() {
    // If the state isn't initialized, this will throw on runtime
    // before the data is initially loaded
    const { movies, selectedMovie, user } = this.state;

    if (!user)
      return <LoginView onLoggedIn={(user) => this.onLoggedIn(user)} />;

    // Before the movies have been loaded
    if (!movies) return <div className="main-view" />;

    return (
      <div className="main-view">
        {selectedMovie ? (
          <MovieView movie={selectedMovie} />
        ) : (
          movies.map((movie) => (
            <Container>
              <Row>
                <Col>
                  <MovieCard
                    key={movie._id}
                    movie={movie}
                    onClick={(movie) => this.onMovieClick(movie)}
                  />
                </Col>
              </Row>
            </Container>
          ))
        )}
      </div>
    );
  }
}
