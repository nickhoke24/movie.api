import React from "react";
import axios from "axios";
// import Col from "react-bootstrap/Col";
// import Row from "react-bootstrap/Row";
// import Container from "react-bootstrap/Container";
// import PropTypes from "prop-types";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

import { BrowserRouter as Router, Route } from "react-router-dom";

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
    const { movies, user, profileInfo } = this.state;

    if (!movies) return <div className="main-view" />;

    return (
      <Router>
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
              return movies.map((m) => <MovieCard key={m._id} movie={m} />);
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

MainView.propTypes = {
  // so far no props needed
};

// import React from "react";
// import axios from "axios";

// import { BrowserRouter as Router, Route } from "react-router-dom";

// import { LoginView } from "../login-view/login-view";
// import { RegistrationView } from "../registration-view/registration-view";
// import { MovieCard } from "../movie-card/movie-card";
// import { MovieView } from "../movie-view/movie-view";
// import { ProfileView } from "../profile-view/profile-view";
// import { DirectorView } from "../director-view/director-view";
// import { GenreView } from "../genre-view/genre-view";
// // import { UpdateView } from "../update-view/update-view";
// import Button from "react-bootstrap/Button";
// import Navbar from "react-bootstrap/Navbar";
// import { Link } from "react-router-dom";
// import "./main-view.scss";
// import Row from "react-bootstrap/Row";
// import Container from "react-bootstrap/Container";
// import Col from "react-bootstrap/Col";

// export class MainView extends React.Component {
//   constructor() {
//     // Call the superclass constructor
//     // so React can initialize it
//     super();

//     // Initialize the state to an empty object so we can destructure it later
//     this.state = {
//       movies: [],
//       user: null,
//       profileInfo: null,
//     };
//   }

//   getMovies(token) {
//     axios
//       .get("https://myflixdbnickhoke.herokuapp.com/movies", {
//         headers: { Authorization: "Bearer " + token },
//       })
//       .then((response) => {
//         // Assign result to a state
//         this.setState({
//           movies: response.data,
//         });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   getAccount(accessToken) {
//     const url =
//       "https://myflixdbnickhoke.herokuapp.com/users/" +
//       localStorage.getItem("user");
//     console.log(url);
//     axios
//       .get(url, {
//         headers: { Authorization: "Bearer " + accessToken },
//       })
//       .then((response) => {
//         // console.log(response.data);
//         // Assign result to a state
//         this.setState({
//           profileInfo: response.data,
//         });
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }

//   componentDidMount() {
//     //  Get value of token from localStorage if present
//     let accessToken = localStorage.getItem("token");
//     if (accessToken !== null) {
//       this.setState({
//         user: localStorage.getItem("user"),
//       });
//       this.getMovies(accessToken);
//       this.getAccount(accessToken);
//     }
//   }

//   logOut() {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("id");
//     this.setState({
//       user: null,
//     });
//   }

//   onLoggedIn(authData) {
//     this.setState({
//       user: authData.user.Username,
//     });
//     // Add authData to browser's cache (that we got from props.logInFunc(data) in the profile.view)
//     localStorage.setItem("token", authData.token);
//     localStorage.setItem("user", authData.user.Username);
//     localStorage.setItem("id", authData.user._id);
//     // Calls endpoint once user is logged in
//     this.getMovies(authData.token);
//     this.getAccount(authData.token);
//   }

//   render() {
//     // If the state isn't initialized, this will throw on runtime
//     // before the data is initially loaded
//     const { movies, user, profileInfo } = this.state;

//     // Logging to check states
//     // console.log('M = ' + movies);
//     // console.log('U = ' + user);
//     // console.log('pi =' + profileInfo);

//     // Before the movies have been loaded
//     if (!movies && !profileInfo) return <div className="main-view" />;

//     return (
//       <Router>
//         <div className="main-view text-center container-fluid main-view-styles ">
//           {/* Nav start */}

//           <Navbar
//             sticky="top"
//             bg="light"
//             expand="lg"
//             className="mb-3 shadow-sm p-3 mb-5"
//           >
//             <Navbar.Brand
//               href="http://localhost:1234/"
//               className="navbar-brand"
//             >
//               VFA
//             </Navbar.Brand>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
//             <Navbar.Collapse
//               className="justify-content-end"
//               id="basic-navbar-nav"
//             >
//               {!user ? (
//                 <ul>
//                   <Link to={`/`}>
//                     <Button variant="link">login</Button>
//                   </Link>
//                   <Link to={`/register`}>
//                     <Button variant="link">Register</Button>
//                   </Link>
//                 </ul>
//               ) : (
//                 <ul>
//                   <Link to={`/`}>
//                     <Button variant="link" onClick={() => this.logOut()}>
//                       Log out
//                     </Button>
//                   </Link>
//                   <Link to={`/user/`}>
//                     <Button variant="link">Account</Button>
//                   </Link>
//                   <Link to={`/`}>
//                     <Button variant="link">Movies</Button>
//                   </Link>
//                   {/* <Link to={`/about`}>
//                     <Button variant="link">About</Button>
//                   </Link>
//                   <Link to={`/contact`}>
//                     <Button variant="link">Contact</Button>
//                   </Link> */}
//                 </ul>
//               )}
//             </Navbar.Collapse>
//           </Navbar>
//           {/* Nav end */}
//           {/* If this.user === null don't show Link */}
//           <Route
//             exact
//             path="/"
//             render={() => {
//               if (!user)
//                 return (
//                   <LoginView logInFunc={(user) => this.onLoggedIn(user)} />
//                 );
//               return (
//                 <div className="row d-flex mt-4 ml-2">
//                   {movies.map((m) => (
//                     <MovieCard key={m._id} movie={m} />
//                   ))}
//                 </div>
//               );
//             }}
//           />
//           <Route
//             path="/movies/:movieId"
//             render={({ match }) => (
//               <MovieView
//                 movie={movies.find((m) => m._id === match.params.movieId)}
//               />
//             )}
//           />
//           <Route
//             path="/user/"
//             render={() => (
//               <ProfileView
//                 user={user}
//                 profileInfo={this.state.profileInfo}
//                 movies={movies}
//                 logOutFunc={() => this.logOut()}
//               />
//             )}
//           />
//           {/* <Route
//             path="/Update/:name"
//             render={() => (
//               <UpdateView user={user} profileInfo={this.state.profileInfo} />
//             )}
//           /> */}
//           <Route
//             path="/directors/:name"
//             render={({ match }) => (
//               <DirectorView
//                 director={movies.find(
//                   (m) => m.Director.Name === match.params.name
//                 )}
//                 movies={movies}
//               />
//             )}
//           />
//           <Route
//             path="/genres/:name"
//             render={({ match }) => (
//               <GenreView
//                 genre={movies.find((m) => m.Genre.Name === match.params.name)}
//                 movies={movies}
//               />
//             )}
//           />

//           <Route path="/register" render={() => <RegistrationView />} />
//         </div>
//       </Router>
//     );
//   }
// }
