import React from "react";
import axios from "axios";

import { MovieCard } from "../movie-card/movie-card";

export class MainView extends React.Component {
  componentDidMount() {
    axios
      .get("<my-api-endpoint/movies>")
      .then((response) => {
        this.setState({
          movies: response.data,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  render() {
    const { movies } = this.state;
    if (!movies) return <div className="main-view" />;
    return (
      <div className="main-view">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    );
  }
}
