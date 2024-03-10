import React from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function BtnDrop() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => {
    return state.userReducer.user;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_ERROR" });
    navigate(`/`);
    toast.success("Logged Out");
  };

  const home = () => {
    navigate("/home");
  };
  const profile = () => {
    navigate(`/profile/${user._id}`);
  };

  return (
    <Dropdown className="d-lg-none">
      <Dropdown.Toggle
        className="btn btn-outline-secondary shadow"
        id="dropdown-basic"
        style={{ background: "white" }}
      >
        <i
          className="fa-regular fa-comments fa-flip-horizontal fa-2xl d-lg-none"
          style={{ color: "#57a2ce" }}
        ></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={home}>
          <i className="fa-solid fa-house fa-xs me-2"></i>
          Home
        </Dropdown.Item>
        <Dropdown.Item onClick={profile}>
          <i className="fa-solid fa-user fa-xs me-2"></i>
          Profile
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item onClick={handleLogout} to="/login">
          <i className="fa-solid fa-right-from-bracket fa-xs me-2"></i>
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BtnDrop;
