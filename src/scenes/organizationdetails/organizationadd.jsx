import { Box } from "@mui/material";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  message,
  Typography,
} from "antd";
import { Country, State, City } from "country-state-city";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const { Text } = Typography;

const Organizationadd = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();
  const location = useLocation();
  const countries = Country.getAllCountries(); // <-- Fix for 'countries' is not defined
  const { organizationid, organizationname } = location.state || {};

  // Only editable fields in branchInstances, org id/name come from ticket
  const [branchInstances, setBranchInstances] = useState([
    {
      branch: "",
      email: "",
      phoneCode: "",
      phoneno: "",
      address: "",
      city: "",
      province: "",
      country: "",
      postcode: "",
      branchtype: "",
      passwords: "",
    },
  ]);

  const handleAddBranch = () => {
    setBranchInstances([
      ...branchInstances,
      {
        branch: "",
        email: "",
        phoneCode: "",
        phoneno: "",
        address: "",
        city: "",
        province: "",
        country: "",
        postcode: "",
        branchtype: "",
        passwords: "",
      },
    ]);
  };

  const handleRemoveBranch = (index) => {
    if (branchInstances.length > 1) {
      setBranchInstances(branchInstances.filter((_, i) => i !== index));
    }
  };

  const handleFormSubmit = async () => {
    setIsLoading(true);
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};
    const createrrole = userDetails.extraind10 || "admin";
    const createrid = "1";
    try {
      for (const branch of branchInstances) {
        const payload = {
          organizationid: branch.organizationid || "",
          organizationname: branch.organizationname || "",
          branch: branch.branch,
          branchtype: branch.branchtype || "Parent",
          phonecode: branch.phoneCode,
          mobile: branch.phoneno,
          email: branch.email,
          username: branch.name ? branch.organizationname.toLowerCase() : "",
          passwords: branch.passwords || "defaultPassword123",
          country: branch.country,
          state: branch.province,
          district: branch.city,
          address: branch.address,
          postalcode: branch.postcode,
          createrid,
          createrrole,
        };
        await axios.post(
          `${process.env.REACT_APP_API_URL}api/api/v1/organizationAdding`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      message.success("Organization Registered successfully!");
      form.resetFields();
      setBranchInstances([
        {
          branch: "",
          email: "",
          phoneCode: "",
          phoneno: "",
          address: "",
          city: "",
          province: "",
          country: "",
          postcode: "",
          branchtype: "",
          passwords: "",
        },
      ]);
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
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          {branchInstances.map((branch, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #eee",
                marginBottom: 2,
                paddingBottom: 2,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Form.Item label="Organization Id">
                    <Input
                      value={organizationid || ""}
                      disabled
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#f5f5f5", // light grey shade for disabled
                        fontSize: 16,
                        color: "#888", // slightly grey text
                        cursor: "not-allowed",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label="Organization Name">
                    <Input
                      value={organizationname || ""}
                      disabled
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#f5f5f5", // light grey shade for disabled
                        fontSize: 16,
                        color: "#888", // slightly grey text
                        cursor: "not-allowed",
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label={<b>Branch Type</b>}
                    name="branchtype"
                    required
                  >
                    <Select
                      value={branch.branchtype}
                      onChange={(value) => {
                        const updated = [...branchInstances];
                        updated[index].branchtype = value;
                        setBranchInstances(updated);
                      }}
                      placeholder="Select Branch Type"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                      // disabled={!editMode ? true : false}
                    >
                      <Select.Option value="Parent">Parent</Select.Option>
                      <Select.Option value="Branch">Branch</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Branch Name"
                    name={[index, "branch"]}
                    rules={[
                      { required: true, message: "Branch Name is required" },
                    ]}
                  >
                    <Input
                      value={branch.branch}
                      onChange={(e) => {
                        const updated = [...branchInstances];
                        updated[index].branch = e.target.value;
                        setBranchInstances(updated);
                      }}
                      placeholder="Branch Name"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={<Text strong>Phone Number</Text>} required>
                    <Input.Group compact>
                      <Form.Item
                        name="phoneCode"
                        noStyle
                        rules={[{ required: true, message: "Code" }]}
                        value={branch.phoneCode}
                        onChange={(e) => {
                          const updated = [...branchInstances];
                          updated[index].phoneCode = e.target.value;
                          setBranchInstances(updated);
                        }}
                      >
                        <Select
                          showSearch
                          style={{ width: 160 }}
                          placeholder="Code"
                          optionFilterProp="children"
                          disabled={false} // Disable if not editing
                          size="large"
                          value={branch.phoneCode}
                          onChange={(e) => {
                            const updated = [...branchInstances];
                            updated[index].phoneCode = e.target.value;
                            setBranchInstances(updated);
                          }}
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
                          {
                            required: true,
                            message: "Phone number is required",
                          },
                          {
                            pattern: /^[0-9]+$/,
                            message: "Only numbers allowed",
                          },
                          { min: 10, message: "At least 10 digits" },
                        ]}
                      >
                        <Input
                          style={{ width: "calc(100% - 160px)" }}
                          placeholder="Phone Number"
                          disabled={false}
                          size="large"
                          value={branch.phoneno}
                          onChange={(e) => {
                            const updated = [...branchInstances];
                            updated[index].phoneno = e.target.value;
                            setBranchInstances(updated);
                          }}
                        />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Email Id"
                    name={[index, "email"]}
                    rules={[
                      {
                        required: true,
                        type: "email",
                        message: "Valid email is required",
                      },
                    ]}
                  >
                    <Input
                      value={branch.email}
                      onChange={(e) => {
                        const updated = [...branchInstances];
                        updated[index].email = e.target.value;
                        setBranchInstances(updated);
                      }}
                      placeholder="Email"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Country"
                    name={[index, "country"]}
                    rules={[{ required: true, message: "Country is required" }]}
                  >
                    <Select
                      showSearch
                      value={branch.country}
                      onChange={(value) => {
                        const updated = [...branchInstances];
                        updated[index].country = value;
                        updated[index].province = "";
                        updated[index].city = "";
                        setBranchInstances(updated);
                      }}
                      placeholder="Select Country"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                    >
                      {Country.getAllCountries().map((c) => (
                        <Select.Option key={c.isoCode} value={c.name}>
                          {c.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="State/Province"
                    name={[index, "province"]}
                    rules={[
                      { required: true, message: "State/Province is required" },
                    ]}
                  >
                    <Select
                      showSearch
                      value={branch.province}
                      onChange={(value) => {
                        const updated = [...branchInstances];
                        updated[index].province = value;
                        updated[index].city = "";
                        setBranchInstances(updated);
                      }}
                      placeholder="Select State/Province"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                      disabled={!branch.country}
                    >
                      {(branch.country
                        ? State.getStatesOfCountry(
                            Country.getAllCountries().find(
                              (c) => c.name === branch.country
                            )?.isoCode
                          )
                        : []
                      ).map((s) => (
                        <Select.Option key={s.isoCode} value={s.name}>
                          {s.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="City"
                    name={[index, "city"]}
                    rules={[{ required: true, message: "City is required" }]}
                  >
                    <Select
                      showSearch
                      value={branch.city}
                      onChange={(value) => {
                        const updated = [...branchInstances];
                        updated[index].city = value;
                        setBranchInstances(updated);
                      }}
                      placeholder="Select City"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                      disabled={!branch.province}
                    >
                      {(branch.province
                        ? City.getCitiesOfState(
                            Country.getAllCountries().find(
                              (c) => c.name === branch.country
                            )?.isoCode,
                            State.getStatesOfCountry(
                              Country.getAllCountries().find(
                                (c) => c.name === branch.country
                              )?.isoCode
                            ).find((s) => s.name === branch.province)?.isoCode
                          )
                        : []
                      ).map((city) => (
                        <Select.Option key={city.name} value={city.name}>
                          {city.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item
                    label="Postal Code"
                    name={[index, "postcode"]}
                    rules={[
                      { required: true, message: "Postal Code is required" },
                    ]}
                  >
                    <Input
                      value={branch.postcode}
                      onChange={(e) => {
                        const updated = [...branchInstances];
                        updated[index].postcode = e.target.value;
                        setBranchInstances(updated);
                      }}
                      placeholder="Postal Code"
                      size="large"
                      style={{
                        borderRadius: 8,
                        background: "#fff",
                        fontSize: 16,
                      }}
                    />
                  </Form.Item>
                </Col>
                {/* Add more fields as needed, following the same pattern */}
                {branchInstances.length > 1 && (
                  <Col
                    xs={24}
                    md={8}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Button
                      danger
                      onClick={() => handleRemoveBranch(index)}
                      style={{ width: "100%" }}
                    >
                      Remove Branch
                    </Button>
                  </Col>
                )}
              </Row>
            </Box>
          ))}
          <Box display="flex" justifyContent="flex-start" mt="10px" gap="10px">
            <Button
              type="dashed"
              onClick={handleAddBranch}
              style={{ padding: "8px 16px", borderRadius: 8, fontWeight: 600 }}
            >
              + Add Branch
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: "bold",
                borderRadius: "8px",
                backgroundColor: "#3e4396",
                color: "#fff",
              }}
            >
              Create
            </Button>
          </Box>
        </Form>
      </Box>
    </>
  );
};

export default Organizationadd;
