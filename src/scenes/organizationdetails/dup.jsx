import { Box } from "@mui/material";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  message,
  Space,
} from "antd";
import { Country, State, City } from "country-state-city";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const { Text } = Typography;

const OrganizationDetails = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [originalBranch, setOriginalBranch] = useState(null);
  const [branchesData, setBranchesData] = useState([]);
  const Navigate = useNavigate();
  const location = useLocation();
  const countries = Country.getAllCountries();

  // Get initial data from navigation (organization.jsx sends via state)
  const ticket = location.state?.ticket || {};

  useEffect(() => {
    const fetchGetAllData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_REACT_APP_API_URL}api/v1/getOrganizationBranchesByOrgid/${ticket.id}`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.rows)) {
          setBranchesData(data.rows.map((item) => item.branch || "N/A"));
        } else {
          setBranchesData([]);
        }
      } catch (error) {
        setBranchesData([]);
        console.error("Error fetching tickets:", error);
      }
    };
    fetchGetAllData();
  }, [ticket.id]);

  // Single branch state
  const [branch, setBranch] = useState({
    orgid: ticket.id || "",
    organizationname: ticket.name || "",
    branchtype: ticket.branchtype || "",
    branch: ticket.brachname || "",
    email: ticket.email || "",
    phoneCode: ticket.phonecode || "",
    phoneno: ticket.mobile || "",
    address: ticket.address || "",
    city: ticket.district || "",
    province: ticket.state || "",
    country: ticket.country || "",
    postcode: ticket.postalcode || "",
    passwords: ticket.passwords || "",
  });

  // For country/state/city select sync
  const getStates = (countryName) => {
    const country = countries.find((c) => c.name === countryName);
    return country ? State.getStatesOfCountry(country.isoCode) : [];
  };
  const getCities = (countryName, stateName) => {
    const country = countries.find((c) => c.name === countryName);
    const state = country
      ? State.getStatesOfCountry(country.isoCode).find(
          (s) => s.name === stateName
        )
      : null;
    return country && state
      ? City.getCitiesOfState(country.isoCode, state.isoCode)
      : [];
  };

  // Sync form fields with branch state
  useEffect(() => {
    form.setFieldsValue(branch);
  }, [branch, form]);

  const handleEdit = () => {
    setEditMode(true);
    setOriginalBranch({ ...branch });
  };

  const handleCancel = () => {
    setBranch(originalBranch || branch);
    setEditMode(false);
    setOriginalBranch(null);
  };

  // useEffect(() => {
  //   const fetchTickets = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:8080/api/v1/getOrganizationBranchesByOrgid/${ticket.id}`);
  //       const data = await response.json();
  //       if (response.ok && Array.isArray(data.rows)) {
  //         setBranchesData(data.rows.map(item => item.branch || "N/A"));
  //       } else {
  //         setBranchesData([]);
  //       }
  //     } catch (error) {
  //       setBranchesData([]);
  //       console.error("Error fetching tickets:", error);
  //     }
  //   };
  //   fetchTickets();
  // }, [ticket.id]);

  // const handlegetinput = async() => {

  // }

  const handleSave = async (values) => {
    setIsLoading(true);
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};
    const createrrole = userDetails.extraind10 || "admin";
    const createrid = "1";
    try {
      // Send as JSON, not FormData
      const payload = {
        organizationid: values.orgid,
        organizationname: values.organizationname,
        branch: values.branch,
        branchtype: values.branchtype || "Parent",
        phonecode: values.phoneCode,
        mobile: values.phoneno,
        email: values.email,
        country: values.country,
        state: values.province,
        district: values.city,
        address: values.address,
        postalcode: values.postcode,
        createrid,
        createrrole,
      };
      await axios.post(
        "http://localhost:8080/api/v1/UpdateOrganizationDetails",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      setBranch(values);
      message.success("Organization updated successfully!");
      setEditMode(false);
      setOriginalBranch(null);

      Navigate("/organization");
    } catch (error) {
      console.error("Error submitting form data:", error);
    } finally {
      setIsLoading(false);
    }
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
          <p>Loading... Please wait while we process your request.</p>
        </div>
      )}
      <Box m="15px" sx={{ backgroundColor: "#ffffff", padding: "20px" }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={branch}
          onFinish={handleSave}
        >
          <Box
            sx={{
              backgroundColor: "#ffffff",
              borderBottom: "1px solid #eee",
              marginBottom: 2,
              paddingBottom: 2,
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>ID</Text>}
                  name="orgid"
                  rules={[{ required: true, message: "org id is required" }]}
                >
                  <Input
                    value={branch.orgid}
                    onChange={(e) =>
                      setBranch({ ...branch, orgid: e.target.value })
                    }
                    placeholder="ORG ID"
                    size="large"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>Organization Name</Text>}
                  name="organizationname"
                  rules={[
                    {
                      required: true,
                      message: "Organization Name is required",
                    },
                  ]}
                >
                  <Input
                    value={branch.organizationname}
                    onChange={(e) =>
                      setBranch({ ...branch, organizationname: e.target.value })
                    }
                    placeholder="Organization Name"
                    size="large"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>Branch Type</Text>}
                  name="branchtype"
                  required
                >
                  <Select
                    value={branch.branchtype}
                    onChange={(value) =>
                      setBranch({ ...branch, branchtype: value })
                    }
                    placeholder="Select Branch Type"
                    size="large"
                    style={{
                      borderRadius: 8,
                      background: "#fff",
                      fontSize: 16,
                    }}
                    disabled={!editMode}
                  >
                    <Select.Option value="Parent">Parent</Select.Option>
                    <Select.Option value="Branch">Branch</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>Branch Name</Text>}
                  name="branch"
                  required
                >
                  <Input
                    value={branch.branch}
                    onChange={(e) =>
                      setBranch({ ...branch, branch: e.target.value })
                    }
                    placeholder="Branch Name"
                    size="large"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label={<Text strong>Phone Number</Text>} required>
                  <Space.Compact style={{ width: "100%" }}>
                    <Form.Item name="phoneCode" noStyle required>
                      <Select
                        showSearch
                        style={{ width: 160 }}
                        placeholder="Code"
                        optionFilterProp="children"
                        size="large"
                        value={branch.phoneCode}
                        onChange={(value) =>
                          setBranch({ ...branch, phoneCode: value })
                        }
                        disabled={!editMode}
                      >
                        {countries.map((c) => (
                          <Select.Option
                            key={c.isoCode}
                            value={`+${c.phonecode}`}
                          >{`+${c.phonecode} (${c.name})`}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item name="phoneno" noStyle required>
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Phone Number"
                        size="large"
                        value={branch.phoneno}
                        onChange={(e) =>
                          setBranch({ ...branch, phoneno: e.target.value })
                        }
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>Email Id</Text>}
                  name="email"
                  required
                >
                  <Input
                    value={branch.email}
                    onChange={(e) =>
                      setBranch({ ...branch, email: e.target.value })
                    }
                    placeholder="Email"
                    size="large"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>Country</Text>}
                  name="country"
                  required
                >
                  <Select
                    showSearch
                    value={branch.country}
                    onChange={(value) =>
                      setBranch({
                        ...branch,
                        country: value,
                        province: "",
                        city: "",
                      })
                    }
                    placeholder="Select Country"
                    size="large"
                    style={{
                      borderRadius: 8,
                      background: "#fff",
                      fontSize: 16,
                    }}
                    disabled={!editMode}
                  >
                    {countries.map((c) => (
                      <Select.Option key={c.isoCode} value={c.name}>
                        {c.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>State/Province</Text>}
                  name="province"
                  required
                >
                  <Select
                    showSearch
                    value={branch.province}
                    onChange={(value) =>
                      setBranch({ ...branch, province: value, city: "" })
                    }
                    placeholder="Select State/Province"
                    size="large"
                    style={{
                      borderRadius: 8,
                      background: "#fff",
                      fontSize: 16,
                    }}
                    disabled={!branch.country || !editMode}
                  >
                    {getStates(branch.country).map((s) => (
                      <Select.Option key={s.isoCode} value={s.name}>
                        {s.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>City</Text>}
                  name="city"
                  required
                >
                  <Select
                    showSearch
                    value={branch.city}
                    onChange={(value) => setBranch({ ...branch, city: value })}
                    placeholder="Select City"
                    size="large"
                    style={{
                      borderRadius: 8,
                      background: "#fff",
                      fontSize: 16,
                    }}
                    disabled={!branch.province || !editMode}
                  >
                    {getCities(branch.country, branch.province).map((city) => (
                      <Select.Option key={city.name} value={city.name}>
                        {city.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>Address</Text>}
                  name="address"
                  required
                >
                  <Input
                    value={branch.address}
                    onChange={(e) =>
                      setBranch({ ...branch, address: e.target.value })
                    }
                    placeholder="Address"
                    size="large"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item
                  label={<Text strong>Postal Code</Text>}
                  name="postcode"
                  required
                >
                  <Input
                    value={branch.postcode}
                    onChange={(e) =>
                      setBranch({ ...branch, postcode: e.target.value })
                    }
                    placeholder="Postal Code"
                    size="large"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Row gutter={[16, 16]}>
                  {branchesData.length > 0 && (
                    <Col span={24}>
                      <Typography.Title
                        level={5}
                        style={{ margin: "16px 0 8px 0" }}
                      >
                        Branches Data
                      </Typography.Title>
                    </Col>
                  )}
                  {branchesData.map((branchName, idx) => (
                    <Col xs={24} md={8} key={idx}>
                      <Input
                        value={branchName}
                        disabled
                        size="large"
                        style={{
                          borderRadius: 8,
                          background: "#f5f5f5",
                          fontSize: 16,
                          color: "#888",
                          cursor: "not-allowed",
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Box>
        </Form>
        <Row justify="end" style={{ marginTop: 32 }} gutter={16}>
          {!editMode ? (
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
                onClick={handleEdit}
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
                  style={{ background: "#3e4396" }}
                  loading={isLoading}
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
        <Box display="flex" justifyContent="flex-start" mt="10px" gap="10px">
          <Button
            type="dashed"
            onClick={() => Navigate("/organizationadd", { state: { ticket } })}
            style={{ padding: "8px 16px", borderRadius: 8, fontWeight: 600 }}
          >
            + Add Branch
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default OrganizationDetails;
