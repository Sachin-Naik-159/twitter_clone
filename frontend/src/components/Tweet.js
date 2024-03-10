import React, { useEffect } from "react";
import "./Tweet.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
import BtnTweetRpy from "./BtnTweetRpy";

function Tweet(tweet) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const tweetData = tweet.tweet;
  const reload = tweet.refresh;
  const tweet_id = window.location.pathname.split("/")[2];

  //Like button
  const like = async () => {
    const resp = await axios.post(
      `${API_BASE_URL}/tweet/${tweetData._id}/like`
    );
    if (resp.status === 200) {
      toast.success(resp.data.message);
    }
    reload();
  };

  //Unlike button
  const unlike = async () => {
    const resp = await axios.post(
      `${API_BASE_URL}/tweet/${tweetData._id}/dislike`
    );
    if (resp.status === 200) {
      toast.success(resp.data.message);
    }
    reload();
  };

  //Retweet button
  const retweet = async () => {
    const resp = await axios.post(
      `${API_BASE_URL}/tweet/${tweetData._id}/retweet`
    );
    if (resp.status === 200) {
      toast.success(resp.data.message);
    }

    reload();
  };

  //Thrash function
  const thrash = async () => {
    if (tweet.type !== "tweet") {
      const resp = await axios.delete(`${API_BASE_URL}/tweet/${tweetData._id}`);
      if (resp.status === 200) {
        toast.success(resp.data.message);
      }
    }
    reload();
  };

  //Navigate to reply page
  const replyPage = () => {
    navigate(`/tweetPage/${tweetData._id}`);
    reload();
  };

  //Navigate to profile page
  const tweetUserProfile = () => {
    navigate(`/profile/${tweetData.tweetedBy._id}`);
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="row shadow-sm mt-2 mb-2 pt-1 pb-2">
      {/* Tweet Profile Pic */}
      <div className="col-2 d-flex  justify-content-center align-items-centre">
        <img
          src={tweetData.tweetedBy.profilePic}
          alt="ProfilePic"
          className="rounded-circle shadow"
          height="50"
          width="50"
        />
      </div>

      <div className="col-9 ">
        {/* Retweet info */}
        {tweetData.retweetBy.length !== 0 ? (
          <div className="row">
            <small className="text-muted">
              <i className="fa-solid fa-retweet fa-xs retweet"></i> retweet by
              {"    "}
              {tweetData.retweetUser}
            </small>
          </div>
        ) : (
          <></>
        )}

        {/* Tweet info */}
        <div className="row">
          <p>
            @
            <b className="hover-underline-animation" onClick={tweetUserProfile}>
              {tweetData.tweetedBy.username}
            </b>
            -{" "}
            <small className="text-muted">
              {` ${new Date(tweetData.createdAt)}`.substring(0, 16)}
            </small>
          </p>
        </div>

        {/* Tweet Content */}
        <div className="row">
          <div>
            {tweetData.contentPic ? (
              <img
                src={tweetData.contentPic}
                alt="Preview"
                width="100%"
                height="auto"
              />
            ) : (
              <></>
            )}
          </div>
          <p>{tweetData.content}</p>
        </div>

        {/* Buttons for functionality */}
        <div className="row mb-4 position-relative">
          {/* Like/dislike button */}
          <div className="position-absolute ps-5 customPosition-1">
            {tweetData.likes.find((data) => {
              return data === user._id;
            }) !== undefined ? (
              <button
                className="customButton"
                onClick={() => {
                  unlike();
                }}
              >
                <i
                  className="fa-solid fa-heart fa-xs me-1"
                  style={{ color: "red" }}
                ></i>
                <small>{tweetData.likes.length}</small>
              </button>
            ) : (
              <button
                className="customButton"
                onClick={() => {
                  like();
                }}
              >
                <i
                  className="fa-regular fa-heart fa-xs me-1"
                  style={{ color: "red" }}
                ></i>
                <small>{tweetData.likes.length}</small>
              </button>
            )}
          </div>

          {/* Reply Button */}
          <div className="position-absolute ps-5  customPosition-2">
            <BtnTweetRpy data={tweetData} refresh={reload} />
          </div>

          {/* Retweet Button */}
          <div className="position-absolute ps-5  customPosition-3">
            <button
              className="customButton"
              onClick={() => {
                retweet();
              }}
            >
              <i
                className="fa-solid fa-retweet fa-xs me-1"
                style={{ color: "green" }}
              ></i>
              <small>{tweetData.retweetBy.length}</small>
            </button>
          </div>
        </div>
      </div>

      <div className="col-1 d-flex">
        {/* Delete Button */}
        {tweetData.tweetedBy._id === user._id && tweet.type !== "tweet" ? (
          <>
            <button
              className="customButton row align-items-start"
              onClick={() => {
                thrash();
              }}
            >
              <i
                className="fa-regular fa-trash-can mt-1 pe-1"
                style={{ color: "maroon" }}
              ></i>
            </button>
          </>
        ) : (
          <></>
        )}

        {/* Reply page button */}
        {tweetData.replies.length > 0 && tweet_id !== tweetData._id ? (
          <>
            <button
              className="customButton row align-items-end"
              onClick={() => {
                replyPage();
              }}
            >
              <i
                className="fa-solid fa-angles-right mt-1 pe-1"
                style={{ color: "gray " }}
              ></i>
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Tweet;
