import React, { useState, useRef } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import {
  Form,
  Input,
  Button,
  Avatar,
  Row,
  Col,
  message,
  Modal,
  Spin,
  Typography,
} from "antd";
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "antd/dist/reset.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  const userDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};
  const firstName = userDetails.firstname;
  const middleName = userDetails.middlename;
  const lastName = userDetails.lastname;
  const email = userDetails.email;
  const phoneNo = userDetails.mobile;
  const userGender = userDetails.extraind2;
  const country = userDetails.extraind3;
  const state = userDetails.extraind4;
  const city = userDetails.extraind5;
  const password = userDetails.password;
  const profileImageUrl = userDetails.imageUrl;

  const initialValues = {
    firstName: firstName || "",
    middleName: middleName || "",
    lastName: lastName || "",
    password: password || "",
    city: city || "",
    state: state || "",
    country: country || "",
    email: email || "",
    PhoneNo: phoneNo || "",
    gender: userGender || "",
  };

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("Required"),
    middleName: yup.string(),
    lastName: yup.string().required("Required"),
    password: yup.string().required("Required"),
    city: yup.string().required("Required"),
    state: yup.string().required("Required"),
    country: yup.string().required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    PhoneNo: yup
      .string()
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(10, "Must be at least 10 digits")
      .required("Required"),
    gender: yup.string().required("Required"),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const sessionData = JSON.parse(sessionStorage.getItem("userDetails"));
    const adminid = sessionData?.adminid || "";
    const password = values.password;
    const formData = new FormData();
    formData.append("adminid", adminid);
    formData.append("password", password);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("gender", values.gender);
    if (values.profileImageFile) {
      formData.append("adminProfileImage", values.profileImageFile);
    }
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/api/v1/updateAdminProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Profile updated successfully!");
      let updatedUserDetails = { ...sessionData, password };
      if (response.data && response.data.imageUrl) {
        updatedUserDetails.imageUrl = response.data.imageUrl;
      }
      sessionStorage.setItem("userDetails", JSON.stringify(updatedUserDetails));
      setIsEditing(false);
    } catch (error) {
      message.error("Error submitting form");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    if (!isEditing) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setCropModalVisible(true);
      };
      reader.readAsDataURL(file);
    }
  };

  function onImageLoad(e) {
    setCrop({
      unit: "%",
      x: 10,
      y: 10,
      width: 80,
      height: 80,
      aspect: 1,
    });
  }

  const handleCropComplete = (crop) => {
    setCompletedCrop(crop);
  };

  const handleCropImage = async () => {
    if (!completedCrop || !imgRef.current) return;
    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfileImage(reader.result);
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const handleSaveCroppedImage = async () => {
    await handleCropImage();
    setCropModalVisible(false);
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: 8,
    padding: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    margin: 16,
    maxWidth: 900,
    marginLeft: "auto",
    marginRight: "auto",
  };

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            color: "#fff",
            fontSize: "20px",
          }}
        >
          <Spin size="large" fullscreen />
        </div>
      )}

      <div style={cardStyle}>
        {/* Styled heading similar to organization details */}
        <Typography.Title
          level={3}
          style={{
            color: "#3e4396",
            fontWeight: "bold",
            marginBottom: 32,
            textAlign: "center",
            letterSpacing: 1,
          }}
        >
          Profile Details
        </Typography.Title>
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            resetForm,
          }) => (
            <>
              <form onSubmit={handleSubmit}>
                <Row justify="center" style={{ marginBottom: 24 }}>
                  <Col>
                    <Avatar
                      size={120}
                      src={
                        profileImage ||
                        profileImageUrl ||
                        "https://via.placeholder.com/150"
                      }
                      style={{
                        border: "2px solid #1677ff",
                        cursor: isEditing ? "pointer" : "default",
                        opacity: isEditing ? 1 : 0.8,
                      }}
                      onClick={() => isEditing && fileInputRef.current?.click()}
                      icon={<CameraOutlined />}
                    />
                    {isEditing && (
                      <div style={{ marginTop: 8, textAlign: "center" }}>
                        <Button
                          type="dashed"
                          icon={<CameraOutlined />}
                          size="small"
                          onClick={() => fileInputRef.current?.click()}
                          style={{ borderRadius: 8 }}
                        >
                          {profileImage ? "Change Photo" : "Add Photo"}
                        </Button>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ display: "none" }}
                      disabled={!isEditing}
                    />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Typography.Text strong>First Name</Typography.Text>
                    <Form.Item
                      validateStatus={
                        touched.firstName && errors.firstName ? "error" : ""
                      }
                      help={touched.firstName && errors.firstName}
                    >
                      <Input
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Typography.Text strong>Last Name</Typography.Text>
                    <Form.Item
                      validateStatus={
                        touched.lastName && errors.lastName ? "error" : ""
                      }
                      help={touched.lastName && errors.lastName}
                    >
                      <Input
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Typography.Text strong>Email</Typography.Text>
                    <Form.Item
                      validateStatus={
                        touched.email && errors.email ? "error" : ""
                      }
                      help={touched.email && errors.email}
                    >
                      <Input
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Typography.Text strong>Phone Number</Typography.Text>
                    <Form.Item
                      validateStatus={
                        touched.PhoneNo && errors.PhoneNo ? "error" : ""
                      }
                      help={touched.PhoneNo && errors.PhoneNo}
                    >
                      <Input
                        name="PhoneNo"
                        value={values.PhoneNo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Typography.Text strong>Gender</Typography.Text>
                    <Form.Item
                      validateStatus={
                        touched.gender && errors.gender ? "error" : ""
                      }
                      help={touched.gender && errors.gender}
                    >
                      <Input
                        name="gender"
                        value={values.gender}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Typography.Text strong>Password</Typography.Text>
                    <Form.Item
                      validateStatus={
                        touched.password && errors.password ? "error" : ""
                      }
                      help={touched.password && errors.password}
                    >
                      <Input.Password
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={!isEditing}
                        size="large"
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row justify="end" gutter={16} style={{ marginTop: 24 }}>
                  {isEditing && (
                    <>
                      <Col>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SaveOutlined />}
                          loading={isLoading}
                          size="large"
                          style={{
                            fontWeight: "bold",
                            borderRadius: 8,
                            background: "#3e4396",
                          }}
                        >
                          Save
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          htmlType="button"
                          type="default"
                          icon={<CloseOutlined />}
                          size="large"
                          style={{
                            marginLeft: 8,
                            fontWeight: "bold",
                            borderRadius: 8,
                          }}
                          onClick={() => {
                            setIsEditing(false);
                            resetForm();
                            setProfileImage(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </Col>
                    </>
                  )}
                </Row>
              </form>
              <Row justify="end" gutter={16} style={{ marginTop: 16 }}>
                {!isEditing && (
                  <Col>
                    <Button
                      htmlType="button"
                      icon={<EditOutlined />}
                      size="large"
                      style={{
                        background: "#3e4396",
                        color: "#fff",
                        fontWeight: "bold",
                        borderRadius: 8,
                      }}
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  </Col>
                )}
              </Row>
              {/* Crop Modal */}
              <Modal
                open={cropModalVisible}
                title="Crop Profile Picture"
                onCancel={() => setCropModalVisible(false)}
                onOk={handleSaveCroppedImage}
                okText="Save Photo"
                cancelText="Cancel"
                width={400}
                styles={{ body: { height: 350 } }}
              >
                {originalImage && (
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={handleCropComplete}
                    aspect={1}
                    circularCrop
                  >
                    <img
                      ref={imgRef}
                      src={originalImage}
                      onLoad={onImageLoad}
                      style={{ maxHeight: "70vh", maxWidth: "100%" }}
                      alt="Crop preview"
                    />
                  </ReactCrop>
                )}
              </Modal>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Profile;
