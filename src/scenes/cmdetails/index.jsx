import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Avatar,
  Modal,
  Typography,
  message,
  Spin,
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Country } from "country-state-city";
import { useLocation, useNavigate } from "react-router-dom";

const { Text } = Typography;

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  const cropWidth = mediaWidth * 0.9;
  const cropHeight = cropWidth / aspect;
  const cropX = (mediaWidth - cropWidth) / 2;
  const cropY = (mediaHeight - cropHeight) / 2;
  return {
    unit: "%",
    x: (cropX / mediaWidth) * 100,
    y: (cropY / mediaHeight) * 100,
    width: (cropWidth / mediaWidth) * 100,
    height: (cropHeight / mediaHeight) * 100,
  };
}

const CmDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const location = useLocation();
  const Navigate = useNavigate();
  const [crmIdList, setCrmIdList] = useState([]);

  // Add state for CRM Name
  const [crmName, setCrmName] = useState("");

  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);

  useEffect(() => {
    if (ticket.country) {
      // const country = Country.getAllCountries().find((c) => c.name === ticket.country);
      // setSelectedCountry(country || null);
    }
  }, [ticket]);

  const initialValues = useMemo(
    () => ({
      id: ticket.id || "",
      firstName: ticket.firstname || "",
      lastName: ticket.lastname || "",
      email: ticket.email || "",
      PhoneNo: ticket.mobile || "",
      phoneCode: ticket.phonecode || "",
      crmid: ticket.crmid || "",
      crmname: ticket.crmname || "",
      customerManager: ticket.customerManager || "",
      organization: ticket.organization || "",
      gender: ticket.gender || "",
      status: ticket.status || "",
      organizationid: ticket.organizationid || "",
      organizationname: ticket.organizationname || "",
      customerrelationshipmanagername:
        ticket.customerrelationshipmanagername || "",
      branch: ticket.branch || "",
      imageUrl: ticket.imageUrl || "",
    }),
    [ticket]
  );

  const [form] = Form.useForm();

  // Extract crmid for useEffect dependency (must be after form is defined)
  const crmidValue = form.getFieldValue("crmid");

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  useEffect(() => {
    // Fetch CRM IDs for dropdown
    const fetchCrmIds = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getCrmId`
        );
        if (response.ok) {
          const data = await response.json();
          // The backend returns { crmid: [ { crmid: "CRM_017" }, ... ] }
          if (Array.isArray(data.crmid)) {
            setCrmIdList(data.crmid.map((item) => item.crmid));
          }
        }
      } catch (error) {
        // handle error
      }
    };
    fetchCrmIds();
  }, [ticket]);

  // When CRM ID changes, fetch CRM Name
  useEffect(() => {
    if (!isEditing) return;
    if (crmidValue) {
      fetch(
        `${process.env.REACT_APP_API_URL}/v1/getCrmNamebyId/${crmidValue}`
      )
        .then((res) => res.json())
        .then((data) => {
          setCrmName(data.crmNames || "");
          form.setFieldsValue({ crmname: data.crmNames || "" });
        });
    } else {
      setCrmName("");
      form.setFieldsValue({ crmname: "" });
    }
  }, [isEditing, crmidValue, form]);

  const handleFormSubmit = async (values) => {
    // Build FormData for multipart/form-data
    setIsLoading(true);
    const formData = new FormData();
    formData.append("cmid", values.id);
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("phoneCode", values.phoneCode);
    formData.append("PhoneNo", values.PhoneNo);
    formData.append("crmid", values.crmid);
    formData.append(
      "crmname",
      values.crmname || values.customerrelationshipmanagername
    );
    formData.append("organizationid", values.organizationid || "");
    formData.append(
      "organizationname",
      values.organization || values.organizationname
    );
    formData.append("branch", values.branch);
    formData.append("gender", values.gender);
    formData.append("status", values.status);
    // formData.append('password', values.password || '');
    // formData.append('createrrole', createrrole);
    // formData.append('createrid', createrid);

    console.log("Form Data:", {
      cmid: values.id || ticket.id || "",
      firstname: values.firstName || "",
      lastname: values.lastName || "",
      email: values.email || "",
      phoneCode: values.phoneCode || "",
      mobile: values.PhoneNo || "",
      crmid: values.crmid || "",
      crmname: values.crmname || values.customerrelationshipmanagername || "",
      organizationname: values.organization || values.organizationname || "",
      branch: values.branch || "",
    });

    const sessionData = JSON.parse(sessionStorage.getItem("userDetails")); // replace with your actual key
    const createrrole = sessionData?.extraind10 || "";
    const createrid =
      sessionData?.adminid || sessionData?.crmid || sessionData?.hobid || "";
    formData.append("createrrole", createrrole);
    formData.append("createrid", createrid);

    console.log();

    // Add profile image if present
    if (profileImage) {
      // Convert base64 to Blob
      const arr = profileImage.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new Blob([u8arr], { type: mime });
      formData.append("cmProfileImageByAdminHob", file, "profile.jpg");
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/updateCmProfileByAdminHob`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("Customer Manager details updated successfully");
        // alert('Customer Manager details updated successfully');
        setIsLoading(false);
        setIsEditing(false);
        Navigate("/cm"); // Redirect to the list page after successful update
      } else {
        // alert('Update failed: ' + (data?.error || response.statusText));
        message.error("Update failed: " + (data?.error || response.statusText));
        setIsEditing(false);
      }
    } catch (error) {
      // alert('Error submitting form');
      message.error("Error submitting form");
      setIsEditing(false);
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

  const triggerFileInput = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1));
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

  const handleCancel = () => {
    setIsEditing(false);
  };

  const countries = Country.getAllCountries();
  const gender = ["Male", "Female"];
  const status = ["Suspend", "Active"];

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
          {/* <div style={{ position: 'absolute', top: '60%', width: '100%', textAlign: 'center', color: '#fff', fontSize: 18 }}>
                    Loading... Please wait while we process your request.
                  </div> */}
        </div>
      )}
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 24,
          margin: 16,
          boxShadow: "2px 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleFormSubmit}
        >
          {/* Profile Image Section */}
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={
                    profileImage ||
                    initialValues.imageUrl ||
                    "https://via.placeholder.com/150"
                  }
                  size={120}
                  style={{
                    border: "2px solid #1677ff",
                    cursor: isEditing ? "pointer" : "default",
                    opacity: isEditing ? 1 : 0.8,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                  onClick={triggerFileInput}
                />
                <Button
                  icon={<CameraOutlined />}
                  shape="circle"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    background: "#1677ff",
                    color: "#fff",
                    border: "none",
                    opacity: isEditing ? 1 : 0.7,
                  }}
                  onClick={triggerFileInput}
                  disabled={!isEditing}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                  disabled={!isEditing}
                />
              </div>
            </Col>
          </Row>
          <Modal
            open={cropModalVisible}
            title="Crop Profile Picture"
            onCancel={() => setCropModalVisible(false)}
            onOk={handleSaveCroppedImage}
            okText="Save Photo"
            cancelText="Cancel"
            width={400}
            bodyStyle={{ height: 350 }}
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
          {/* Main Form Fields */}
          <Row gutter={24}>
            {/* CRM ID Dropdown */}
            {/* <Col xs={24} md={8}>
            <Form.Item
              label={<Text strong>CRM ID</Text>}
              name="crmid"
              rules={[{ required: true, message: 'CRM ID is required' }]}
            >
              <Select
                showSearch
                placeholder="Select CRM ID"
                optionFilterProp="children"
                disabled={!isEditing}
                size="large"
                onChange={async (value) => {
                  // Fetch CRM Name on change
                  try {
                    const res = await fetch(`http://localhost:8080/api/v1/getCrmNamebyId/${value}`);
                    const data = await res.json();
                    setCrmName(data.crmNames || '');
                    form.setFieldsValue({ crmname: data.crmNames || '' });
                  } catch {
                    setCrmName('');
                    form.setFieldsValue({ crmname: '' });
                  }
                }}
              >
                {crmIdList.map((id) => (
                  <Select.Option key={id} value={id}>{id}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col> */}

            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>ID</Text>}
                name="id"
                rules={[{ required: true, message: "Id is required" }]}
              >
                <Input placeholder="First Name" disabled={true} size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>First Name</Text>}
                name="firstName"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input
                  placeholder="First Name"
                  disabled={!isEditing}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Last Name</Text>}
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input
                  placeholder="Last Name"
                  disabled={!isEditing}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Organization Id</Text>}
                name="organizationid"
                rules={[
                  { required: true, message: "Organization Id is required" },
                ]}
              >
                <Input
                  placeholder="Organization Id"
                  disabled={true}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Organization Name</Text>}
                name="organizationname"
                rules={[
                  { required: true, message: "Organization name is required" },
                ]}
              >
                <Input
                  placeholder="Organization Name"
                  disabled={true}
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Branch Name</Text>}
                name="branch"
                rules={[{ required: true, message: "Branch name is required" }]}
              >
                <Input placeholder="Branch Name" disabled={true} size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Email Id</Text>}
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Valid email is required",
                  },
                ]}
              >
                <Input placeholder="Email" disabled={!isEditing} size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label={<Text strong>Phone Number</Text>} required>
                <Input.Group compact>
                  <Form.Item
                    name="phoneCode"
                    noStyle
                    rules={[{ required: true, message: "Code" }]}
                  >
                    <Select
                      showSearch
                      style={{ width: 160 }}
                      placeholder="Code"
                      optionFilterProp="children"
                      disabled={!isEditing}
                      size="large"
                    >
                      {countries.map((c) => (
                        <Select.Option
                          key={c.isoCode}
                          value={`+${c.phonecode}`}
                        >{`+${c.phonecode} (${c.name})`}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="PhoneNo"
                    noStyle
                    rules={[
                      { required: true, message: "Phone number is required" },
                      { pattern: /^[0-9]+$/, message: "Only numbers allowed" },
                      { min: 10, message: "At least 10 digits" },
                    ]}
                  >
                    <Input
                      style={{ width: "calc(100% - 160px)" }}
                      placeholder="Phone Number"
                      disabled={!isEditing}
                      size="large"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Gender</Text>}
                name="gender"
                rules={[{ required: true, message: "Gender is required" }]}
              >
                <Select
                  placeholder="Select Gender"
                  disabled={!isEditing}
                  size="large"
                >
                  {gender.map((g) => (
                    <Select.Option key={g} value={g}>
                      {g}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Status</Text>}
                name="status"
                rules={[{ required: true, message: "Status is required" }]}
              >
                <Select
                  placeholder="Select Status"
                  disabled={!isEditing}
                  size="large"
                >
                  {status.map((s) => (
                    <Select.Option key={s} value={s}>
                      {s}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>CRM ID</Text>}
                name="crmid"
                rules={[{ required: true, message: "CRM ID is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select CRM ID"
                  optionFilterProp="children"
                  disabled={!isEditing}
                  size="large"
                  onChange={async (value) => {
                    // Fetch CRM Name on change
                    try {
                      const res = await fetch(
                        `${process.env.REACT_APP_API_URL}api/v1/getCrmNamebyId/${value}`
                      );
                      const data = await res.json();
                      setCrmName(data.crmNames || "");
                      form.setFieldsValue({ crmname: data.crmNames || "" });
                    } catch {
                      setCrmName("");
                      form.setFieldsValue({ crmname: "" });
                    }
                  }}
                >
                  {crmIdList.map((id) => (
                    <Select.Option key={id} value={id}>
                      {id}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* CRM Name Input (auto-filled) */}
            <Col xs={24} md={8}>
              <Form.Item label={<Text strong>CRM Name</Text>} name="crmname">
                <Input
                  placeholder="CRM Name"
                  value={crmName}
                  disabled
                  readOnly
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* Form Actions moved outside the Form to keep buttons always enabled */}
        </Form>
        <Row justify="end" style={{ marginTop: 32 }} gutter={16}>
          {!isEditing ? (
            <Col>
              <Button
                type="primary"
                style={{
                  background: "#3e4396",
                  color: "#fff",
                  fontWeight: "bold",
                  borderRadius: 8,
                }}
                size="large"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </Col>
          ) : (
            <>
              <Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  style={{
                    background: "#3e4396",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 8,
                  }}
                  onClick={() => form.submit()}
                >
                  Save
                </Button>
              </Col>
              <Col>
                <Button size="large" danger onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
            </>
          )}
        </Row>
      </div>
    </>
  );
};

export default CmDetails;
