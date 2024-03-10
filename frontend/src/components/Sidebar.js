import React from "react";
import "./Sidebar.css";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Sidebar(rf) {
  const reload = rf.refresh;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  let user = useSelector((state) => {
    return state.userReducer.user;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGIN_ERROR" });
    navigate("/");
    toast.success("Logged Out");
  };

  return (
    <div className="container shadow mt-3 p-4 rounded vh-100 position-fixed position-relative sidebar">
      <div className=" justify-content-start align-items-start mt-1">
        <i
          className="shadow fa-regular fa-comments fa-flip-horizontal fa-2xl mt-5 mb-4"
          style={{ color: "#57a2ce" }}
        ></i>

        {/* Links */}
        <h3 className="mt-5 title pt-2 pb-2">
          <Link className="linksDecol" to="/home">
            <i className="fa-solid fa-house fa-sm me-2"></i>
            Home
          </Link>
        </h3>
        <h3 className="mt-5 title pt-2 pb-2">
          <Link
            className="linksDecol"
            to={`/profile/${user._id}`}
            onClick={reload}
          >
            <i className="fa-solid fa-user fa-sm me-2"></i>
            Profile
          </Link>
        </h3>
        <h3 className="mt-5 title pt-2 pb-2">
          <Link className="linksDecol" to="/" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket fa-sm me-2"></i>
            Logout
          </Link>
        </h3>
      </div>

      {/* User Details */}
      <div className="position-absolute customPosition">
        <div className="d-flex  justify-content-center ">
          <img
            src={user.profilePic}
            alt="ProfilePic"
            className="rounded-circle shadow-lg me-2 img-fluid"
            style={{ height: "60px", width: "60px" }}
          />
          <div>
            {/* User card */}
            <>
              <h5>
                <small>
                  <strong>{user.name}</strong>
                </small>
              </h5>
              <small>
                <small className="text-muted">@{user.username}</small>
              </small>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
