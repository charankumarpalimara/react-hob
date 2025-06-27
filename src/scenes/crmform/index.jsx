import React, { useState, useRef, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  Avatar,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import { CameraOutlined } from "@ant-design/icons";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const { Option } = Select;

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

const CrmForm = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [organizationNames, setOrganizationNames] = useState([]);
  const [branchNames, setBranchNames] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  // const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalEditValues, setOriginalEditValues] = useState({});
  const [createdCrmId, setCreatedCrmId] = useState(null);
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllOrgs`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          setOrganizationNames(
            data.data.map((item) => item.organizationname || "N/A")
          );
        }
      } catch (error) {
        console.error("Error fetching organization names:", error);
      }
    };
    fetchOrganizations();
  }, []);

  const fetchBranch = async (organization) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getBranchbyOrganizationname/${organization}`
      );
      if (response.ok) {
        const data = await response.json();
        setBranchNames(
          Array.isArray(data.branchDetails)
            ? data.branchDetails
            : [data.branchDetails]
        );
      } else {
        setBranchNames([]);
      }
    } catch (error) {
      setBranchNames([]);
      console.error("Error fetching branch:", error);
    }
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

  // const triggerFileInput = () => {
  //   if (fileInputRef.current) fileInputRef.current.click();
  // };

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem("hobDetails"));
    const createrrole = "hob";
    const createrid = sessionData?.hobid || "";
    const password = (values.firstName || "") + (values.PhoneNo || "");

    formData.append("firstname", values.firstName || "");
    formData.append("lastname", values.lastName || "");
    formData.append("phonecode", values.phoneCode || "");
    formData.append("mobile", values.PhoneNo || "");
    formData.append("email", values.email || "");
    formData.append("gender", values.gender || "");
    // formData.append("organization", values.organization || "");
    // formData.append("branch", values.branch || "");
    formData.append("country", values.country || "");
    formData.append("state", values.state || "");
    formData.append("city", values.city || "");
    formData.append("username", values.email || "");
    formData.append("passwords", password);
    formData.append("createrrole", createrrole);
    formData.append("createrid", createrid);
    formData.append("postalcode", values.postcode || "");

    if (profileImage) {
      try {
        let blob;
        if (profileImage.startsWith("data:")) {
          const res = await fetch(profileImage);
          blob = await res.blob();
        } else {
          blob = profileImage;
        }
        formData.append("crmimage", blob, "profileImage.jpg");
      } catch (error) {
        console.error("Error converting image to blob:", error);
      }
    }

    try {
      const response = await axios.post(
        // `${process.env.REACT_APP_API_URL}/v1/createcrm`,
        `http://127.0.0.1:8080/v1/createCrm`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (
        response.status === 200 &&
        response.data &&
        response.data.message === "User registered successfully"
      ) {
        const crmData = response.data.data || {};
        const FinalCrmid = response.data.crmid || crmData.crmid;
        // Modal.success({ content: "CRM Registered Successfully!" });
        message.success("CRM Registered Successfully!");
        setEditValues({ ...values, profileImage, crmid: FinalCrmid }); // <-- set modal values
        setCreatedCrmId(FinalCrmid);
        setOriginalEditValues({ ...values, profileImage });
        setShowEditModal(true); // <-- open modal
        setIsEditMode(false);
        setIsLoading(false);
        console.log("CRM created with ID:", FinalCrmid);
        // Navigate("/hob/crm");
      } else {
        Modal.error({
          content: response.data?.error || "Error submitting form",
        });
      }
    } catch (error) {
      Modal.error({ content: "Error submitting form" });
    } finally {
      setIsLoading(false);
    }
  };




  const handleUpdate = async () => {
    const values = editValues;
    setIsLoading(true);
    const formData = new FormData();
    const sessionData = JSON.parse(sessionStorage.getItem("hobDetails"));
    const createrrole = "hob";
    const createrid = sessionData?.hobid || "";
    const password = (values.firstName || "") + (values.PhoneNo || "");
    formData.append("crmid", createdCrmId);
    formData.append("firstname", values.firstName || "");
    formData.append("lastname", values.lastName || "");
    formData.append("phonecode", values.phoneCode || "");
    formData.append("mobile", values.PhoneNo || "");
    formData.append("email", values.email || "");
    formData.append("gender", values.gender || "");
    // formData.append("organization", values.organization || "");
    // formData.append("branch", values.branch || "");
    formData.append("country", values.country || "");
    formData.append("state", values.state || "");
    formData.append("city", values.city || "");
    formData.append("username", values.email || "");
    formData.append("passwords", password);
    formData.append("createrrole", createrrole);
    formData.append("createrid", createrid);
    formData.append("postalcode", values.postcode || "");

    if (profileImage) {
      try {
        let blob;
        if (profileImage.startsWith("data:")) {
          const res = await fetch(profileImage);
          blob = await res.blob();
        } else {
          blob = profileImage;
        }
        formData.append("crmimage", blob, "profileImage.jpg");
      } catch (error) {
        console.error("Error converting image to blob:", error);
      }
    }

    try {
      const response = await axios.post(
        // `${process.env.REACT_APP_API_URL}/v1/updateCrm`,
         `http://127.0.0.1:8080/v1/updateCrm`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (
        response.status === 200 &&
        response.data.message === "User updated successfully"
      ) {
        // Modal.success({ content: "CRM Registered Successfully!" });
        message.success("Details Updated Successfully!");
        navigate("/hob/crm");
      } else {
        Modal.error({
          content: response.data?.error || "Error submitting form",
        });
      }
    } catch (error) {
      Modal.error({ content: "Error submitting form" });
    } finally {
      setIsLoading(false);
    }
  };





  const handleCancelEdit = () => {
    setEditValues(originalEditValues);
    setIsEditMode(false);
  };

  // Close modal
  const handleModalClose = () => {
    setShowEditModal(false);
    navigate(-1); // Go to previous page
  };




  const countries = Country.getAllCountries();

  const states = selectedCountry
    ? State.getStatesOfCountry(
      countries.find((c) => c.name === selectedCountry)?.isoCode || ""
    )
    : [];

  const cities = selectedState
    ? City.getCitiesOfState(
      countries.find((c) => c.name === selectedCountry)?.isoCode || "",
      states.find((s) => s.name === selectedState)?.isoCode || ""
    )
    : [];
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


      <Modal
        open={showEditModal}
        title="Review & Edit CM Details"
        onCancel={handleModalClose}
        closable={false}
        footer={null}
        width="80%"
      >
        <Form
          layout="vertical"
          initialValues={editValues}
          onValuesChange={(_, allValues) => setEditValues({ ...editValues, ...allValues })}
        >
          <Row justify="center" style={{ marginBottom: 24 }}>
            <Col>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={editValues.profileImage || "https://via.placeholder.com/150"}
                  size={120}
                  style={{
                    border: "2px solid #1677ff",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                />
              </div>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Code" name="phoneCode" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Phone Number" name="PhoneNo" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            {/* <Col xs={24} md={8}>
              <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
                <Select disabled={!isEditMode}>
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
            </Col> */}
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>Gender</b>}
                name="gender"

                rules={[{ required: true, message: "Gender is required" }]}
              >
                <Select
                  placeholder="Select Gender"
                  disabled={!isEditMode}
                  // size="large"
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
                label={<b>Country</b>}
                name="country"
                rules={[{ required: true, message: "Country is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Country"
                  // size="large"
                  disabled={!isEditMode}
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  onChange={(value) => {
                    setSelectedCountry(value);
                    form.setFieldsValue({ state: "", city: "" });
                  }}
                >
                  {countries.map((c) => (
                    <Option key={c.isoCode} value={c.name}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>State</b>}
                name="state"
                rules={[{ required: true, message: "State is required" }]}
              // disabled={!isEditMode} 
              >
                <Select
                  showSearch
                  placeholder="Select State"
                  // size="large"

                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  onChange={(value) => {
                    setSelectedState(value);
                    form.setFieldsValue({ city: "" });
                  }}
                  disabled={!isEditMode || !selectedCountry}
                >
                  {states.map((s) => (
                    <Option key={s.isoCode} value={s.name}>
                      {s.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>City</b>}
                name="city"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select City"
                  // size="large"

                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  disabled={!isEditMode || !selectedState}
                >
                  {cities.map((city) => (
                    <Option key={city.name} value={city.name}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>Postal Code</b>}
                name="postcode"
                rules={[{ required: true, message: "Postal Code is required" }]}
              >
                <Input
                  placeholder="Postal Code"
                  // size="large"
                  disabled={!isEditMode}
                  style={{ borderRadius: 8,  fontSize: 16 }}
                />
              </Form.Item>
            </Col>


          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            {!isEditMode ? (
              <>
                <Button
                  type="primary"
                  onClick={() => setIsEditMode(true)}
                  style={{
                    background: "#3e4396",
                    borderColor: "#3e4396",
                    color: "#fff",
                    fontWeight: "bold",
                    minWidth: 120,
                  }}
                >
                  Edit
                </Button>
                <Button
                  style={{ marginLeft: 12 }}
                  onClick={handleModalClose}
                  danger
                >
                  Close
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="primary"
                  onClick={handleUpdate}
                  loading={isLoading}
                  style={{
                    background: "#3e4396",
                    borderColor: "#3e4396",
                    color: "#fff",
                    fontWeight: "bold",
                    minWidth: 120,
                  }}
                >
                  Update
                </Button>
                <Button
                  style={{ marginLeft: 12 }}
                  onClick={handleCancelEdit}
                  danger
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </Form>
      </Modal>
      <div
        style={{ background: "#fff", borderRadius: 8, padding: 24, margin: 16 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {    // <-- open the modal
            handleFormSubmit(values);
          }}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phoneCode: "",
            PhoneNo: "",
            gender: "",
            organization: "",
            branch: "",
            country: "",
            state: "",
            city: "",
            postcode: "",
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
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>First Name</b>}
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
                label={<b>Last Name</b>}
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
                label={<b>Email Id</b>}
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
              <Form.Item label={<b>Phone Number</b>} required>
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
                      onChange={(value) => setSelectedCountry(value)}
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
                label={<b>Gender</b>}
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
                label={<b>Country</b>}
                name="country"
                rules={[{ required: true, message: "Country is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Country"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  onChange={(value) => {
                    setSelectedCountry(value);
                    form.setFieldsValue({ state: "", city: "" });
                  }}
                >
                  {countries.map((c) => (
                    <Option key={c.isoCode} value={c.name}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>State</b>}
                name="state"
                rules={[{ required: true, message: "State is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select State"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  onChange={(value) => {
                    setSelectedState(value);
                    form.setFieldsValue({ city: "" });
                  }}
                  disabled={!selectedCountry}
                >
                  {states.map((s) => (
                    <Option key={s.isoCode} value={s.name}>
                      {s.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>City</b>}
                name="city"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select City"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                  disabled={!selectedState}
                >
                  {cities.map((city) => (
                    <Option key={city.name} value={city.name}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<b>Postal Code</b>}
                name="postcode"
                rules={[{ required: true, message: "Postal Code is required" }]}
              >
                <Input
                  placeholder="Postal Code"
                  size="large"
                  style={{ borderRadius: 8, background: "#fff", fontSize: 16 }}
                />
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
                loading={isLoading}
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

export default CrmForm;
