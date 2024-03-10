import {
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import React, { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TweetPage from "./pages/TweetPage";
import axios from "axios";

function App() {
  function DynamicRouting() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        //Authentication
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + localStorage.getItem("token");

        //when user has a login active session
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        navigate("/home");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "LOGIN_ERROR" });
        navigate("/");
      }
      // eslint-disable-next-line
    }, []);

    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/tweetPage/:id" element={<TweetPage />} />
      </Routes>
    );
  }

  return (
    <Router>
      <div className="container">
        <ToastContainer />
        <DynamicRouting />
      </div>
    </Router>
  );
}

export default App;
