import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import BtnDrop from "../components/BtnDrop";
import Tweet from "../components/Tweet";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { API_BASE_URL } from "../config";
import BtnProfEdit from "../components/BtnProfEdit";

function Profile() {
  let _id = window.location.pathname.split("/")[2];

  //Getting tweets
  const [allTweets, setAllTweets] = useState([]);
  const getUserTweets = async () => {
    const resp = await axios.get(`${API_BASE_URL}/user/${_id}/tweets`);
    if (resp.status === 200) {
      setAllTweets(resp.data);
    } else {
      toast.error("Error while fetchinf data");
    }
  };

  //Getting userdata from url
  let initialState = {
    _id: "",
    name: "",
    username: "",
    email: "",
    followers: [],
    following: [],
    profilePic:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    createdAt: "",
    updatedAt: "",
    dateOfBirth: null,
    location: null,
  };
  const [testuser, setTestuser] = useState(initialState);
  const getuser = async (_id) => {
    let resp = await axios.get(`${API_BASE_URL}/user/${_id}`);
    setTestuser(resp.data.result.user);
  };

  //Logged in user
  const user = useSelector((state) => {
    return state.userReducer.user;
  });

  //Follow
  const follow = async () => {
    let resp = await axios.put(`${API_BASE_URL}/user/${_id}/follow`);
    if (resp.status === 200) {
      toast.success(resp.data.message);
      refresh();
    }
  };

  //UnFollow
  const unfollow = async () => {
    let resp = await axios.put(`${API_BASE_URL}/user/${_id}/unfollow`);
    if (resp.status === 200) {
      toast.success(resp.data.message);
      refresh();
    }
  };

  //Function to refresh page
  const refresh = () => {
    getuser(_id);
    getUserTweets();
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, [_id]);

  return (
    <Container>
      <Row>
        <Col md="3" className="d-none d-sm-none d-md-none d-lg-block">
          <Sidebar refresh={refresh} />
        </Col>
        <Col md="9">
          <div className="container shadow mt-3 p-4 rounded">
            {/* Heading of page */}
            <div className="row my-3">
              <div className="col-6 d-flex align-items-center">
                <h3 className="d-none d-sm-none d-md-none d-lg-block">
                  Profile
                </h3>
                <div className="d-lg-none">
                  <BtnDrop />
                </div>
              </div>
            </div>

            <div className="row">
              {/* Profile Pic */}
              <div className="col-lg-4 col-8">
                <img
                  src={testuser.profilePic}
                  alt="ProfilePic"
                  className="rounded-circle shadow-lg mb-5 img-fluid"
                  style={{ height: "200px", width: "200px" }}
                />
              </div>

              {/* Edit buttons */}
              <div className="col-lg-8 col d-flex align-items-end justify-content-end">
                {user._id !== testuser._id ? (
                  <div>
                    {testuser.followers.find((data) => {
                      return (
                        data.toString().replace(/ObjectId\("(.*)"\)/, "$1") ===
                        user._id
                      );
                    }) ? (
                      <>
                        {/* Unfollow */}
                        <button
                          type="button"
                          className="btn btn-outline-dark me-1"
                          onClick={unfollow}
                        >
                          Unfollow
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Follow */}
                        <button
                          type="button"
                          className="btn btn-dark me-1"
                          onClick={follow}
                        >
                          Follow
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <BtnProfEdit refresh={refresh} />
                  </>
                )}
              </div>
            </div>

            {/* User Name */}
            <div className="row">
              <h5>{testuser.name}</h5>
              <p className="text-muted">@{testuser.username}</p>
            </div>

            {/* User Details */}
            <div className="row">
              <div className="col-10">
                <div className="row">
                  <div className="col">
                    {testuser.dateOfBirth !== null ? (
                      <div>
                        <i className="fa-solid fa-cake-candles me-1"></i>
                        <small className="text-muted">
                          Dob,
                          {`${new Date(testuser.dateOfBirth)}`.substring(0, 16)}
                        </small>
                      </div>
                    ) : (
                      <></>
                    )}

                    <div>
                      <i className="fa-solid fa-calendar-day me-1"></i>
                      <small className="text-muted">
                        Join,
                        {` ${new Date(testuser.createdAt)}`.substring(0, 16)}
                      </small>
                    </div>
                  </div>
                  <div className="col">
                    {testuser.location !== null ? (
                      <div>
                        <i className="fa-solid fa-location-dot me-1"></i>
                        <small className="text-muted">
                          {testuser.location}
                        </small>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Count */}
            <div className="row mt-3">
              <small className="ml-2">
                <b className="me-3">{`${testuser.following.length} Following`}</b>
                <b>{`${testuser.followers.length} Followers`}</b>
              </small>
            </div>

            <div className="row my-1">
              <div className="col-12">
                <hr />
              </div>
            </div>

            {/* Tweets */}
            <div className="col-12">
              <h6 style={{ width: "100%", textAlign: "center" }}>
                <strong className="fs-4">Tweets & Replies</strong>
                <br />
                <br />
                <br />
              </h6>

              {allTweets.map((data) => {
                return (
                  <div className="col-12" key={data._id}>
                    <div>
                      <Tweet tweet={data} refresh={refresh} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Profile;
