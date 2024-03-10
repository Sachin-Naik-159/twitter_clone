import axios from "axios";
import React, { useState } from "react";
import { Button, CardImg, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

function Register() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
  const subminHandler = async (e) => {
    e.preventDefault();
    const resp = await axios.post(`${API_BASE_URL}/auth`, user);
    if (resp.status === 201) {
      toast.success(resp.data.message);
      setUser({ name: "", email: "", username: "", password: "" });
      navigate("/");
    } else {
      toast.error(resp.data.message);
    }
  };
  return (
    <div className="min-vh-100 d-flex align-items-center rounded">
      <Container className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Row className=" justify-content-center align-items-center">
          <Col lg={6}>
            <CardImg
              className="img-fluid rounded"
              src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              height="500"
              alt="Brand Image"
            />
          </Col>
          <Col lg={6}>
            <h1>Register</h1>
            <Form className="mb-3" onSubmit={subminHandler}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                ></Form.Control>
              </Form.Group>
              <Button type="submit" variant="dark">
                Sign Up
              </Button>
            </Form>
            <Form.Text className="mb-3">
              Already Registered?
              <Link to="/">Login Here</Link>
            </Form.Text>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Register;
