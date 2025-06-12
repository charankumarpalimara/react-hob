import { Box } from "@mui/material";
import { Form, Input, Button, Row, Col, Select, message, Spin } from "antd";
import { Country, State, City } from "country-state-city";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrganizationForm = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const Navigate = useNavigate();
  const countries = Country.getAllCountries();
  // const [selectedCountry, setSelectedCountry] = useState("");
  // const [selectedState, setSelectedState] = useState("");
  const [existingOrgs, setExistingOrgs] = useState([]);
  const [branchInstances, setBranchInstances] = useState([
    {
      organization: "",
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
        organization: "",
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

  useEffect(() => {
    const getallOrganizations = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}api/v1/getAllOrgs`
        );
        // If your API returns { data: [{ organizationname: "..." }, ...] }
        const orgs =
          response.data?.data?.map((o) => o.organizationname?.toLowerCase()) ||
          [];
          Navigate("/organization");
        setExistingOrgs(orgs);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    getallOrganizations();
  }, []);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const userDetails = JSON.parse(sessionStorage.getItem("userDetails")) || {};
    const createrrole = userDetails.extraind10 || "admin";
    const createrid = "1";
    try {
      for (const branch of branchInstances) {
        const formData = new FormData();
        formData.append("organizationname", branch.organization);
        formData.append("branch", branch.branch);
        // formData.append("branchtype", branch.branchtype || 'Parent');
        formData.append("phonecode", branch.phoneCode);
        formData.append("mobile", branch.phoneno);
        formData.append("email", branch.email);
        formData.append("username", branch.organization.toLowerCase());
        formData.append("passwords", branch.passwords || "defaultPassword123");
        formData.append("country", branch.country);
        formData.append("state", branch.province);
        formData.append("district", branch.city);
        formData.append("address", branch.address);
        formData.append("postalcode", branch.postcode);
        formData.append("createrid", createrid);
        formData.append("createrrole", createrrole);
        await axios.post(
          `${process.env.REACT_APP_API_URL}api/api/v1/createOrganization`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }
      // alert("Form Data Submitted Successfully");
      message.success("Organization Registered successfully!");
      form.resetFields();
      setBranchInstances([
        {
          organization: "",
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
      // Navigate('/organization');
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
          <Spin size="large" fullscreen />
          {/* <div style={{ position: 'absolute', top: '60%', width: '100%', textAlign: 'center', color: '#fff', fontSize: 18 }}>
                Loading... Please wait while we process your request.
              </div> */}
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
                  <Form.Item
                    label={<b>Organization Name</b>}
                    name={[index, "organization"]}
                    rules={[
                      {
                        required: true,
                        message: "Organization Name is required",
                      },
                      {
                        validator: (_, value) => {
                          if (
                            value &&
                            existingOrgs.includes(value.trim().toLowerCase())
                          ) {
                            return Promise.reject(
                              new Error("Organization name already registered")
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input
                      value={branch.organization}
                      onChange={(e) => {
                        const updated = [...branchInstances];
                        updated[index].organization = e.target.value;
                        setBranchInstances(updated);
                      }}
                      placeholder="Organization Name"
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
                  <Form.Item
                    label={<b>Branch Type</b>}
                    name={[index, "branchtype"]}
                    rules={[
                      { required: true, message: "Branch Type is required" },
                    ]}
                  >
                    <Select
                      value={branch.branchtype}
                      onChange={(value) => {
                        const updated = [...branchInstances];
                        updated[index].branchtype = value;
                        setBranchInstances(updated);
                      }}
                      size="large"
                      style={{ width: "100%", marginBottom: 12 }}
                    >
                      <Select.Option value="Parent">Parent</Select.Option>
                      <Select.Option value="Branch">Branch</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={8}>
                  <Form.Item label={<b>Phone Number</b>} required>
                    <Input.Group compact>
                      <Select
                        showSearch
                        style={{ width: "calc(100% - 60%)" }}
                        placeholder="Code"
                        optionFilterProp="children"
                        size="large"
                        value={branch.phoneCode}
                        onChange={(value) => {
                          const updated = [...branchInstances];
                          updated[index].phoneCode = value;
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
                      <Input
                        style={{ width: "calc(100% - 40%)" }}
                        placeholder="Phone Number"
                        size="large"
                        value={branch.phoneno}
                        onChange={(e) => {
                          const updated = [...branchInstances];
                          updated[index].phoneno = e.target.value;
                          setBranchInstances(updated);
                        }}
                      />
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

export default OrganizationForm;
