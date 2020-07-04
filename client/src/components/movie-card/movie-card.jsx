import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

import { Link } from "react-router-dom";

export class MovieCard extends React.Component {
  render() {
    const { movie } = this.props;

    return (
      <Card style={{ width: "16rem" }}>
        <Card.Img variant="top" src={movie.ImagePath} />
        <Card.Body>
          <Card.Title>{movie.Title}</Card.Title>
          <Card.Text>{movie.Description}</Card.Text>
          <Link to={`/movies/${movie._id}`}>
            <Button variant="link">Open</Button>
          </Link>
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">Director</Button>
          </Link>
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">Genre</Button>
          </Link>
        </Card.Body>
      </Card>
    );
  }
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

// export class MovieCard extends React.Component {
//   render() {
//     // This is given to the <MovieCard/> component by the outer world
//     // which, in this case, is `MainView`, as `MainView` is what’s
//     // connected to your database via the movies endpoint of your API
//     const { movie, onClick } = this.props;

//     return (
//       <Card style={{ width: "18rem" }}>
//         <Card.Img variant="top" src={movie.ImagePath} />
//         <Card.Body>
//           <Card.Title>{movie.Title}</Card.Title>
//           <Card.Text>{movie.Description}</Card.Text>
//           <Button variant="primary" onClick={() => onClick(movie)}>
//             Open
//           </Button>
//         </Card.Body>
//       </Card>
//     );
//   }
// }
