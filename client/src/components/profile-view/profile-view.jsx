// import React from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// import Button from "react-bootstrap/Button";
// import Container from "react-bootstrap/Container";
// import Card from "react-bootstrap/Card";

// export class ProfileView extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       username: null,
//       password: null,
//       email: null,
//       birthday: null,
//       favoriteMovies: [],
//       movies: [],
//     };
//   }

//   componentDidMount() {
//     //authentication
//     const accessToken = localStorage.getItem("token");
//     this.getUser(accessToken);
//   }

//   getUser(token) {
//     const username = localStorage.getItem("user");

//     axios
//       .get(`https://myflixdbnickhoke.herokuapp.com/users/${username}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })

//       .then((res) => {
//         this.setState({
//           Username: res.data.Username,
//           Password: res.data.Password,
//           Email: res.data.Email,
//           Birthday: res.data.Birthday,
//           FavoriteMovies: res.data.FavoriteMovies,
//         });
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
//   }

//   deleteFavoriteMovie(movieId) {
//     console.log(this.props.movies);
//     axios
//       .delete(
//         `https://myflixdbnickhoke.herokuapp.com/users/${localStorage.getItem(
//           "user"
//         )}/Movies/${movieId}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       )
//       .then((res) => {
//         alert("Removed movie from favorites");
//       })
//       .catch((e) => {
//         alert("error removing movie" + e);
//       });
//   }

//   deleteUser(e) {
//     axios
//       .delete(
//         `https://myflixdbnickhoke.herokuapp.com/users/${localStorage.getItem("user")}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       )
//       .then((response) => {
//         alert("Account deleted");
//         localStorage.removeItem("token", "user");
//         window.open("/");
//       })
//       .catch((event) => {
//         alert("failed to delete user");
//       });
//   }

//   render() {
//     const { movies } = this.props;
//     const favoriteMovieList = movies.filter((movie) =>
//       this.state.favoriteMovies.includes(movie._id)
//     );
//     return (
//       <div>
//         <Container>
//           <h1>My Profile</h1>
//           <br />
//           <Card>
//             <Card.Body>
//               <Card.Text>Username: {this.state.Username}</Card.Text>
//               <Card.Text>Password: xxxxxx</Card.Text>
//               <Card.Text>Email: {this.state.Email}</Card.Text>
//               <Card.Text>Birthday: {this.state.Birthday}</Card.Text>
//               Favorite Movies:
//               {favoriteMovieList.map((movie) => (
//                 <div key={movie._id} className="fav-movies-button">
//                   <Link to={`/movies/${movie._id}`}>
//                     <Button variant="link">{movie.Title}</Button>
//                   </Link>
//                   <Button
//                     size="sm"
//                     onClick={(e) => this.deleteFavoriteMovie(movie._id)}
//                   >
//                     Remove Favorite
//                   </Button>
//                 </div>
//               ))}
//               <br />
//               <br />
//               <Link to={"/user/update"}>
//                 <Button variant="primary">Update Profile</Button>
//                 <br />
//                 <br />
//               </Link>
//               <Button onClick={() => this.deleteUser()}>Delete User</Button>
//               <br />
//               <br />
//               <Link to={`/`}>Back</Link>
//             </Card.Body>
//           </Card>
//         </Container>
//       </div>
//     );
//   }
// }

import React from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import "./profile-view.scss";

export class ProfileView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  removeFavourite(movie) {
    /* Send a request to the server for authentication */
    const url =
      "https://myflixdbnickhoke.herokuapp.com/users/" +
      localStorage.getItem("id") +
      "/favourites/" +
      movie; // 'https://vfa.herokuapp.com/users/localStorage.getItem('user')}/favourites/${movie}';
    axios
      .delete(url, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }, //  `Bearer ${localStorage.getItem('token')}`
      })
      // reload page
      .then(() => {
        document.location.reload(true);
      })
      .then(() => {
        alert("Movie removed from favourites");
      })
      .catch((error) => {
        console.log("Issue deleting movie from favourites... >" + error);
      });
  }

  unregisterAccount() {
    if (!confirm("Are you sure?")) {
      return;
    }
    const url =
      "https://myflixdbnickhoke.herokuapp.com/users/" +
      localStorage.getItem("id");
    console.log(url);
    axios
      .delete(url, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        console.log(response.data);
        // Set profile info to null
        this.setState({
          profileInfo: null,
          user: null,
        });
        this.props.logOutFunc();
        window.open("/", "_self");
        alert("Your account was successfully deleted");
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { user, profileInfo, movies } = this.props;
    if (!profileInfo || !user) return <div>Loading</div>;
    console.log(profileInfo.FavouriteMovies);
    const favouritesList = movies.filter((movie) =>
      profileInfo.FavouriteMovies.includes(movie._id)
    );
    console.log("FL =" + favouritesList);

    return (
      <Container className="profile-view wrapper container-fluid">
        <Row>
          <Col className="col-3" />
          <Col className="container-fluid align-items-center col-6">
            <img
              className="profile-avatar "
              src="https://via.placeholder.com/150"
            />
            <div className="account-username ">
              <span className="label">Username: </span>
              <span className="value">{profileInfo.Username}</span>
            </div>
            <div className="account-email ">
              <span className="label">Email: </span>
              <span className="value">{profileInfo.Email}</span>
            </div>
            <div className="account-birthday ">
              <span className="label">Birthday: </span>
              <span className="value">{profileInfo.Birthday}</span>
            </div>
            <div className="account-password ">
              <span className="label">Password: </span>
              <span className="value">***********</span>
            </div>
          </Col>
          <Col className="col-3" />
        </Row>
        <Container>
          <h4>Favourites List</h4>
          <div className="d-flex row mt-3 ml-1">
            {favouritesList.map((movie) => {
              return (
                <div key={movie._id}>
                  <Card className="mb-3 mr-2 h-100" style={{ width: "16rem" }}>
                    <Card.Img variant="top" src={movie.ImagePath} />
                    <Card.Body>
                      <Link className="text-muted" to={`/movies/${movie._id}`}>
                        <Card.Title>{movie.Title}</Card.Title>
                      </Link>
                      <Card.Text>
                        {movie.Description.substring(0, 90)}...
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-top-0">
                      <span className="d-flex align-items-center">
                        <Button
                          variant="primary"
                          size="sm"
                          className="mr-2"
                          onClick={() => this.removeFavourite(movie._id)}
                        >
                          <i className="material-icons bin">Remove</i>
                        </Button>
                      </span>
                    </Card.Footer>
                  </Card>
                </div>
              );
            })}
          </div>
        </Container>

        <Row>
          <Col>
            <Link to={`/update/${profileInfo.Username}`}>
              <Button variant="primary" className="update-button">
                Update my profile
              </Button>
            </Link>
            <div className="">
              <Button onClick={() => this.unregisterAccount()} variant="link">
                Delete Account
              </Button>
            </div>
            <Link to={`/`}>
              <Button variant="link">Home</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

ProfileView.propTypes = {
  profileInfo: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    // ImagePath: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
  }).isRequired,
  logOutFunc: PropTypes.func.isRequired,
};
