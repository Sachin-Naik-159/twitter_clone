import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Tweet from "../components/Tweet";
import BtnDrop from "../components/BtnDrop";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";

function TweetPage() {
  //Getting tweets
  const [allTweets, setAllTweets] = useState([]);
  const getAllTweets = async () => {
    let _id = await window.location.pathname.split("/")[2];
    let resp = await axios.get(`${API_BASE_URL}/tweet/replies/${_id}`);

    if (resp.status === 200) {
      setAllTweets(resp.data);
    } else {
      toast.error("Error while fetchinf data");
    }
  };

  //Main tweet
  const [tweet, setTweets] = useState([]);
  const mainTweet = async () => {
    let _id = await window.location.pathname.split("/")[2];
    const resp = await axios.get(`${API_BASE_URL}/tweet/${_id}`);
    if (resp.status === 200) setTweets(resp.data);
  };

  //Function to refresh page
  const refresh = () => {
    getAllTweets();
    mainTweet();
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);
  return (
    <Container>
      <Row>
        <Col md="3" className="d-none d-sm-none d-md-none d-lg-block">
          <Sidebar refresh={refresh} />
        </Col>
        <Col md="9">
          <div className="container shadow mt-3 p-4 rounded">
            <div className="row my-3">
              <div className="col-6 d-flex align-items-center">
                <h3 className="d-none d-sm-none d-md-none d-lg-block">Tweet</h3>
                <div className="d-lg-none">
                  <BtnDrop />
                </div>
              </div>

              {/* Maintweet */}
              {tweet.map((data) => {
                return (
                  <div className="col-12" key={data._id}>
                    <div>
                      <Tweet tweet={data} refresh={refresh} type={"tweet"} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="row my-3">
              <div className="col-12">
                <hr />
              </div>
            </div>
            <h5 className="d-flex justify-content-center align-items-center">
              Replies
            </h5>
            {/* Tweets */}
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
        </Col>
      </Row>
    </Container>
  );
}

export default TweetPage;
