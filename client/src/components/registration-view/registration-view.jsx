import React, { useState } from "react";
import "./registration-view.scss";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import axios from "axios";
import PropTypes from "prop-types";

export function RegistrationView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (e) => {
    // prevents the default refresh after submit button has been clicked
    e.preventDefault();
    // console.log(username, password, birthday, email);

    /* Send a request to the server for authentication */
    axios
      .post("https://myflixdbnickhoke.herokuapp.com/users", {
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        window.open("/client", "_self"); // the second argument '_self' is necessary so that the page will open in the current tab
      })
      .catch((e) => {
        console.log("error registering the user");
      });
  };

  return (
    <Container>
      <h1>Register an account</h1>
      <Form className="registration-form">
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="Enter username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Birth Date:</Form.Label>
          <Form.Control
            type="string"
            value={birthday}
            placeholder="01/01/2001"
            onChange={(e) => setBirthday(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Button
          variant="btn-lg btn-dark btn-block"
          type="submit"
          onClick={handleSubmit}
        >
          Register
        </Button>
      </Form>
    </Container>
  );
}

RegistrationView.propTypes = {
  onNewUserRegistered: PropTypes.func.isRequired,
};
