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
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      password: null,
      email: null,
      birthday: null,
      favoriteMovies: [],
      movies: [],
    };
  }

  componentDidMount() {
    //authentication
    const accessToken = localStorage.getItem("token");
    this.getUser(accessToken);
    // window.location.reload();
  }

  getUser(token) {
    const username = localStorage.getItem("user");

    axios
      .get(`https://myflixdbnickhoke.herokuapp.com/users/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      .then((res) => {
        this.setState({
          Username: res.data.Username,
          Password: res.data.Password,
          Email: res.data.Email,
          Birthday: res.data.Birthday,
          FavoriteMovies: res.data.FavoriteMovies,
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  removeFavorite(movie) {
    /* Send a request to the server for authentication */
    const url =
      "https://myflixdbnickhoke.herokuapp.com/users/" +
      localStorage.getItem("user") +
      "/Movies/" +
      movie;
    axios
      .delete(url, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      // reload page
      .then(() => {
        document.location.reload(true);
      })
      .then(() => {
        alert("Movie removed from favorites");
      })
      .catch((error) => {
        console.log("Issue deleting movie from favorites... >" + error);
      });
  }

  unregisterAccount() {
    if (!confirm("Are you sure?")) return;
    let token = localStorage.getItem("token");
    let url =
      "https://myflixdbnickhoke.herokuapp.com/users/" + this.state.username;
    axios
      .delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => console.log(response));

    localStorage.removeItem("token");
    // localStorage.removeItem("user");
    window.open("/", "_self");
  }

  render() {
    const { user, profileInfo, movies } = this.props;
    if (!profileInfo || !user) return <div>Loading</div>;
    console.log(profileInfo.FavoriteMovies);
    const favoritesList = movies.filter((movie) =>
      profileInfo.FavoriteMovies.includes(movie._id)
    );
    console.log("FL =" + favoritesList);

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
          <h4>Favorites Movies: </h4>
          <div className="d-flex row mt-3 ml-1">
            {favoritesList.map((movie) => {
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
                          onClick={() => this.removeFavorite(movie._id)}
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
              <Button
                variant="btn-lg btn-dark btn-block"
                className="update-button"
              >
                Update my profile
              </Button>
            </Link>
            <br />
            <div className="">
              <Button
                onClick={() => this.unregisterAccount()}
                variant="btn-lg btn-dark btn-block"
              >
                Delete Account
              </Button>
            </div>
            <br />
            <Link to={`/`}>
              <Button variant="btn-lg btn-dark btn-block">Home</Button>
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
    Birthday: PropTypes.string.isRequired,
  }).isRequired,
  logOutFunc: PropTypes.func.isRequired,
};
