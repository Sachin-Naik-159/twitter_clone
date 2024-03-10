import axios from "axios";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";

function BtnTweetRpy(prop) {
  //Authentication header
  const CONFIG_OBJ = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  const reload = prop.refresh;

  const [rpyContent, setRpyContent] = useState(""); //State for message
  const [rpyShow, setRpyShow] = useState(false); //Satte for reply dialog box
  const handleRpyShow = () => setRpyShow(true);
  const handleRpyClose = () => {
    setRpyShow(false);
    setRpyContent("");
  };

  //Create reply tweet
  const addRpy = async () => {
    if (rpyContent === "") {
      toast.error("Any one field is mandatory!");
    } else {
      const replyResp = await axios.post(
        `${API_BASE_URL}/tweet/${prop.data._id}/reply`,
        { content: rpyContent },
        CONFIG_OBJ
      );
      if (replyResp.status === 201) {
        toast.success(replyResp.data.message);
        handleRpyClose();
        reload();
      } else {
        toast.error("Some error occurred while posting");
      }
    }
  };

  return (
    <>
      {/* ReplyTweet Dialog Box */}
      <button
        className="customButton"
        onClick={() => {
          handleRpyShow();
        }}
      >
        <i
          className="fa-regular fa-comment fa-xs me-1 btns"
          style={{ color: "blue" }}
        ></i>
        <small>{prop.data.replies.length}</small>
      </button>

      <Modal
        show={rpyShow}
        onHide={handleRpyClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reply Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            type="text"
            placeholder="Message"
            value={rpyContent}
            style={{ width: "100%", height: "100px" }}
            onChange={(e) => setRpyContent(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRpyClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addRpy();
            }}
          >
            Tweet
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BtnTweetRpy;
