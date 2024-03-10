import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import BtnDrop from "../components/BtnDrop";
import axios from "axios";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
import Tweet from "../components/Tweet";
import BtnTweet from "../components/BtnTweet";

function Home() {
  //Getting tweets
  const [allTweets, setAllTweets] = useState([]);
  const getAllTweets = async () => {
    const resp = await axios.get(`${API_BASE_URL}/tweet`);

    if (resp.status === 200) {
      setAllTweets(resp.data);
    } else {
      toast.error("Error while fetchinf data");
    }
  };

  //Function to refresh page
  const refresh = () => {
    getAllTweets();
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
                <h3 className="d-none d-sm-none d-md-none d-lg-block">Home</h3>
                <div className="d-lg-none">
                  <BtnDrop />
                </div>
              </div>
              <div className="col-6 d-flex align-items-center justify-content-end">
                <BtnTweet refresh={refresh} />
              </div>
            </div>
            <div className="row my-3">
              <div className="col-12">
                <hr />
              </div>
            </div>

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

export default Home;
