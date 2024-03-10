import axios from "axios";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
import "./uploadbox.css";

function BtnTweet(prop) {
  const refresh = prop.refresh;

  //States for tweet Dialog box
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setContent("");
    setImage({ preview: "", data: "" });
  };

  //Handle Tweet submit (File selection, Upload and Tweet)
  const [content, setContent] = useState("");
  const [image, setImage] = useState({ preview: "", data: "" });
  const handleFileSelect = (event) => {
    const img = {
      preview: URL.createObjectURL(event.target.files[0]),
      data: event.target.files[0],
    };
    setImage(img);
  };
  const handleImgUpload = async () => {
    let formData = new FormData();
    formData.append("file", image.data);
    const response = await axios.post(
      `${API_BASE_URL}/file/uploadFile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  };

  //Create tweet
  const addTweet = async () => {
    if (image.preview === "" && content === "") {
      toast.error("Any one field is mandatory!");
    } else {
      let request = {
        content: content,
        contentPic: null,
        root: true,
      };
      if (image.preview !== "") {
        const imgRes = await handleImgUpload();
        request = {
          ...request,
          contentPic: `${API_BASE_URL}/file/${imgRes.data.fileName}`,
        };
      }
      // write api call to create post
      const postResponse = await axios.post(`${API_BASE_URL}/tweet`, request);
      if (postResponse.status === 201) {
        toast.success(postResponse.data.message);
        handleClose();
        setImage({ preview: "", data: "" });
        setContent("");
        refresh();
      } else {
        toast.error("Some error occurred while posting");
      }
    }
  };

  return (
    <>
      {/* Tweet Dialog Box */}
      <Button className="shadow" onClick={handleShow}>
        Tweet
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            type="text"
            placeholder="Message"
            value={content}
            style={{ width: "100%", height: "100px" }}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="upload-box">
            <div className="dropZoneContainer">
              <input
                name="file"
                type="file"
                id="drop_zone"
                className="FileUpload"
                accept=".jpg,.png,.jpeg"
                onChange={handleFileSelect}
              />
              <div className="dropZoneOverlay">
                {image.preview && (
                  <img
                    src={image.preview}
                    alt="Preview"
                    width="180"
                    height="180"
                  />
                )}
                {image.preview === "" ? (
                  <div>
                    <i className="fa-solid fa-cloud-arrow-up fs-1"></i>
                    <br />
                    Upload Photo From Computer
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              addTweet();
            }}
          >
            Tweet
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BtnTweet;
