import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_BASE_URL } from "../config";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { Button, Form, Modal } from "react-bootstrap";
import "./uploadbox.css";

function BtnProfEdit(prop) {
  const dispatch = useDispatch();
  const refresh = prop.refresh;

  //Update local reducer on change
  const update = async () => {
    let resp = await axios.get(`${API_BASE_URL}/user/${user._id}`);
    if (resp.status === 200) {
      localStorage.setItem("user", JSON.stringify(resp.data.result.user));
      dispatch({ type: "LOGIN_SUCCESS", payload: resp.data.result.user });
    }
  };

  //Logged in user
  const user = useSelector((state) => {
    return state.userReducer.user;
  });

  //edit User data state
  const [edituser, setEditUser] = useState({
    name: "",
    location: "",
    dateOfBirth: new Date(),
  });

  //Handle Dialog box
  const [show, setShow] = useState({ photo: false, profile: false });
  const showPhoto = () => setShow({ ...show, photo: true }); //Photo Dialog Box
  const closePhoto = () => {
    setShow({ ...show, photo: false });
    setImage({ preview: "", data: "" });
  };
  const showEdit = () => setShow({ ...show, profile: true }); //Edit Dialog Box
  const closeEdit = () => {
    setShow({ ...show, profile: false });
    setEditUser({
      name: "",
      location: "",
      dateOfBirth: new Date(),
    });
  };

  //Edit user data
  const hanldeUserSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await axios.put(
        `${API_BASE_URL}/user/${user._id}`,
        edituser
      );
      if (resp.status === 200) {
        toast.success(resp.data.message);
        update();
        refresh();
      }
      if (resp.status === 401) {
        toast.error(resp.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.response.data.message);
    }
    closeEdit();
  };

  //Handle Image
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
  const addPic = async () => {
    if (image.preview === "") {
      toast.error("Post image is mandatory!");
    } else {
      const imgRes = await handleImgUpload();
      const request = {
        profilePic: `${API_BASE_URL}/file/${imgRes.data.fileName}`,
      };
      // write api call to create post
      const postResponse = await axios.post(
        `${API_BASE_URL}/user/${user._id}`,
        request
      );
      if (postResponse.status === 200) {
        toast.success(postResponse.data.message);
        closePhoto();
        setImage({ preview: "", data: "" });
        update();
        refresh();
      } else {
        toast.error("Some error occurred while updating");
      }
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      {/* Update Photo dialog box */}
      <>
        <button
          type="button"
          className="btn btn-outline-primary me-1"
          onClick={showPhoto}
        >
          Update Photo
        </button>

        <Modal
          show={show.photo}
          onHide={closePhoto}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Update Photo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
            <Button variant="secondary" onClick={closePhoto}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                addPic();
              }}
            >
              Upload
            </Button>
          </Modal.Footer>
        </Modal>
      </>

      {/* Edit dialog box */}
      <>
        <button
          type="button"
          className="btn btn-outline-dark me-1"
          onClick={showEdit}
        >
          Edit
        </button>

        <Modal
          show={show.profile}
          onHide={closeEdit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="mb-3" onSubmit={hanldeUserSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="name"
                  value={edituser.name}
                  onChange={(e) =>
                    setEditUser({
                      ...edituser,
                      name: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="place"
                  value={edituser.location}
                  onChange={(e) =>
                    setEditUser({
                      ...edituser,
                      location: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <DatePicker
                  showIcon
                  toggleCalendarOnIconClick
                  isClearable
                  selected={edituser.dateOfBirth}
                  onChange={(date) =>
                    setEditUser({
                      ...edituser,
                      dateOfBirth: date,
                    })
                  }
                  icon="fa fa-calendar"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>
              Close
            </Button>
            <Button variant="primary" onClick={hanldeUserSubmit}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </>
  );
}

export default BtnProfEdit;
