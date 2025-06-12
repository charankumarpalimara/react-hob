import React, { useEffect, useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Select,
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
import axios from "axios";

const { Option } = Select;
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

const CmForm = () => {
  const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const [organizationNames, setOrganizationNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [crmIdList, setCrmIdList] = useState([]);
  const [crmName, setCrmName] = useState("");

  //  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/v1/getAllOrgs`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setOrganizationNames(
            data.data.map((item) => item.organizationname || "N/A")
          );
        }
      } catch (error) {}
    };
    fetchTickets();
  }, []);
  const crmidValue = form.getFieldValue("crmid");

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
  }, []);

  useEffect(() => {
    // if (!isEditing) return;
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
  }, [crmidValue, form]);

  const fetchBranch = async (orgName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getBranchbyOrganizationname/${orgName}`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.branchDetails)) {
          setBranchNames(data.branchDetails);
        } else if (typeof data.branchDetails === "string") {
          setBranchNames([data.branchDetails]);
        } else {
          setBranchNames([]);
        }
      }
    } catch (error) {}
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
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
    setCropModalOpen(false);
  };

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    console.log(crmName);
    const formData = new FormData();

    // Use the exact field names as in your form and backend
    formData.append("firstname", values.firstName || "");
    formData.append("lastname", values.lastName || "");
    formData.append("phonecode", values.phoneCode || "");
    formData.append("mobile", values.PhoneNo || "");
    formData.append("email", values.email || "");
    formData.append("gender", values.gender || "");
    formData.append("designation", values.designation || "");
    formData.append("organization", values.organization || "");
    formData.append("branch", values.branch || "");
    formData.append("username", values.email || "");
    formData.append("crmId", values.crmid || "");
    formData.append("crmName", values.crmname || "");

    const sessionData = JSON.parse(sessionStorage.getItem("userDetails"));
    const createrrole = sessionData?.extraind10 || "";
    const createrid =
      sessionData?.adminid || sessionData?.crmid || sessionData?.hobid || "";
    const password = (values.firstName || "") + (values.PhoneNo || "");
    formData.append("createrrole", createrrole);
    formData.append("createrid", createrid);
    formData.append("passwords", password);

    if (profileImage) {
      try {
        // Convert base64 to blob if needed
        let blob;
        if (profileImage.startsWith("data:")) {
          const res = await fetch(profileImage);
          blob = await res.blob();
        } else {
          blob = profileImage;
        }
        formData.append("cmimage", blob, "profileImage.jpg");
      } catch (error) {
        console.error("Error converting image to blob:", error);
      }
    } else {
      Modal.warning({ content: "Please upload a profile image." });
      setIsLoading(false);
      return;
    }
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}api/v1/createCm`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // Modal.success({ content: "CM Registered Successfully!" });
      message.success("CM Registered Successfully!");

      form.resetFields();
      setProfileImage(null);
      setOriginalImage(null);
    } catch (error) {
      Modal.error({ content: "Error submitting form" });
    } finally {
      setIsLoading(false);
    }
  };

  const countries = Country.getAllCountries();
  const gender = ["Male", "Female"];

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
        style={{ background: "#fff", borderRadius: 8, padding: 24, margin: 16 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phoneCode: "",
            PhoneNo: "",
            gender: "",
            designation: "",
            organization: "",
            branch: "",
            crmid: "",
            crmname: "",
          }}
          validateTrigger={["onChange", "onBlur"]}
          scrollToFirstError
          autoComplete="off"
        >
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={profileImage || "https://via.placeholder.com/150"}
                  size={120}
                  style={{
                    border: "2px solid #1677ff",
                    cursor: "pointer",
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
                  }}
                  onClick={triggerFileInput}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </div>
            </Col>
          </Row>
          <Modal
            open={cropModalOpen}
            title="Crop Profile Picture"
            onCancel={() => setCropModalOpen(false)}
            onOk={handleSaveCroppedImage}
            okText="Save Photo"
            cancelText="Cancel"
            width={400}
            styles={{ body: { height: 350 } }} // <-- updated from bodyStyle
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
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>First Name</Text>}
                name="firstName"
                rules={[{ required: true, message: "First Name is required" }]}
              >
                <Input
                  placeholder="First Name"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Last Name</Text>}
                name="lastName"
                rules={[{ required: true, message: "Last Name is required" }]}
              >
                <Input
                  placeholder="Last Name"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Email Id</Text>}
                name="email"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input
                  placeholder="Email"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label={<Text strong>Phone Number</Text>} required>
                <Input.Group compact>
                  <Form.Item
                    name="phoneCode"
                    noStyle
                    rules={[{ required: true, message: "Code is required" }]}
                  >
                    <Select
                      showSearch
                      style={{ width: 160 }}
                      placeholder="Code"
                      optionFilterProp="children"
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
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                >
                  {gender.map((g) => (
                    <Option key={g} value={g}>
                      {g}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Designation</Text>}
                name="designation"
                rules={[{ required: true, message: "Designation is required" }]}
              >
                <Input
                  placeholder="Designation"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Organization</Text>}
                name="organization"
                rules={[
                  { required: true, message: "Organization is required" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select Organization"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  onChange={async (value) => {
                    form.setFieldsValue({ organization: value, branch: "" });
                    await fetchBranch(value);
                  }}
                >
                  {organizationNames.map((org) => (
                    <Option key={org} value={org}>
                      {org}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>Branch</Text>}
                name="branch"
                rules={[{ required: true, message: "Branch is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Branch"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                >
                  {branchNames.map((b) => (
                    <Option key={b} value={b}>
                      {b}
                    </Option>
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
                  size="large"
                  onChange={async (value) => {
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
            <Col xs={24} md={8}>
              <Form.Item
                label={<Text strong>CRM Name</Text>}
                name="crmname"
                rules={[{ required: true, message: "CRM Name is required" }]}
              >
                <Input placeholder="CRM Name" disabled readOnly size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 32 }} gutter={16}>
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
              >
                Create
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default CmForm;
