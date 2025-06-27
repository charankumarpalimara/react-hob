import { Box } from "@mui/material";
import { Form, Input, Button, Row, Col, Select, message, Spin, Modal } from "antd";
import { Country, State, City } from "country-state-city";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const OrganizationForm = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const countries = Country.getAllCountries();
  // const [selectedCountry, setSelectedCountry] = useState("");
  // const [selectedState, setSelectedState] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editValues, setEditValues] = useState({});
  const [originalEditValues, setOriginalEditValues] = useState({});
  const [createdOrgId, setCreatedOrgId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
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
          `${process.env.REACT_APP_API_URL}/v1/getAllOrgs`
        );
        // If your API returns { data: [{ organizationname: "..." }, ...] }
        const orgs =
          response.data?.data?.map((o) => o.organizationname?.toLowerCase()) ||
          [];

        setExistingOrgs(orgs);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    getallOrganizations();
  }, []);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    const userDetails = JSON.parse(sessionStorage.getItem("hobDetails")) || {};
    const createrrole = userDetails.extraind10 || "hob";
    const createrid = userDetails.hobid;
    let lastResponse = null;
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
        lastResponse = await axios.post(`${process.env.REACT_APP_API_URL}/v1/createOrganization`,
          formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      if (lastResponse) {
        const FinalOrgid = lastResponse.data.orgid;
        message.success("Organization Registered successfully!");
        setEditValues({ ...values, orgid: FinalOrgid });
        setCreatedOrgId(FinalOrgid);
        setOriginalEditValues({ ...values });
        setShowEditModal(true);
        setIsEditMode(false);
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
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      message.error("Submission failed");
    } finally {
      setIsLoading(false);
    }
  };



  const handleUpdate = async () => {
    const values = editValues;
    setIsLoading(true);
    const userDetails = JSON.parse(sessionStorage.getItem("hobDetails")) || {};
    const createrrole = userDetails.extraind10 || "hob";
    const createrid = userDetails.hobid;
    // let lastResponse = null;
    try {
      // for (const branch of branchInstances) {
      const formData = new FormData();
      formData.append("organizationid", createdOrgId);
      formData.append("organizationname", values.organization);
      formData.append("branch", values.branch);
      // formData.append("branchtype", branch.branchtype || 'Parent');
      formData.append("phonecode", values.phoneCode);
      formData.append("mobile", values.phoneno);
      formData.append("email", values.email);
      formData.append("username", values.organization.toLowerCase());
      formData.append("passwords", values.passwords || "defaultPassword123");
      formData.append("country", values.country);
      formData.append("state", values.province);
      formData.append("district", values.city);
      formData.append("address", values.address);
      formData.append("postalcode", values.postcode);
      formData.append("createrid", createrid);
      formData.append("createrrole", createrrole);
      await axios.post(
        // `${process.env.REACT_APP_API_URL}/v1/updateOrganization`, 
        `http://127.0.0.1:8080/v1/updateOrganization`,

        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // }
      message.success("Details Updated Successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error submitting form data:", error);
      message.error("Submission failed");
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
        title="Review & Edit ORGANIZATION Details"
        onCancel={() => setShowEditModal(false)}
        closable={false}
        footer={null}
        width={900}
        okButtonProps={{
          style: {
            background: "#3e4396",
            borderColor: "#3e4396",
            color: "#fff",
            fontWeight: "bold",
          },
        }}
      >
        <Form
          layout="vertical"
          initialValues={editValues}
          onValuesChange={(_, allValues) => setEditValues(allValues)}
        >
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="Organization Name" name="orgid" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Organization Name" name="organization" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Organization Unit" name="branch" rules={[{ required: true }]}>
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
              <Form.Item label="Phone Number" name="phoneno" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Country" name="country" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="Select Country"
                  disabled={!isEditMode}
                  value={editValues.country}
                  onChange={value => setEditValues(ev => ({ ...ev, country: value, province: "", city: "" }))}
                >
                  {Country.getAllCountries().map(c => (
                    <Select.Option key={c.isoCode} value={c.name}>{c.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item label="State" name="province" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="Select State"
                  disabled={!isEditMode || !editValues.country}
                  value={editValues.province}
                  onChange={value => setEditValues(ev => ({ ...ev, province: value, city: "" }))}
                >
                  {(editValues.country
                    ? State.getStatesOfCountry(
                      Country.getAllCountries().find(c => c.name === editValues.country)?.isoCode
                    )
                    : []
                  ).map(s => (
                    <Select.Option key={s.isoCode} value={s.name}>{s.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="City" name="city" rules={[{ required: true }]}>
                <Select
                  showSearch
                  placeholder="Select City"
                  disabled={!isEditMode || !editValues.province}
                  value={editValues.city}
                  onChange={value => setEditValues(ev => ({ ...ev, city: value }))}
                >
                  {(editValues.country && editValues.province
                    ? City.getCitiesOfState(
                      Country.getAllCountries().find(c => c.name === editValues.country)?.isoCode,
                      State.getStatesOfCountry(
                        Country.getAllCountries().find(c => c.name === editValues.country)?.isoCode
                      ).find(s => s.name === editValues.province)?.isoCode
                    )
                    : []
                  ).map(city => (
                    <Select.Option key={city.name} value={city.name}>{city.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Postal Code" name="postcode" rules={[{ required: true }]}>
                <Input disabled={!isEditMode} />
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

      <Box m="15px" sx={{ backgroundColor: "#ffffff", padding: "20px" }}>
        <Form form={form} layout="vertical"
          //   onFinish={() => {
          //   setEditValues(branchInstances[0]);
          //   setShowEditModal(true);
          // }}
          onFinish={() => {    // <-- open the modal
            handleFormSubmit(branchInstances[0]);
          }}

        >
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
                    label={<b>Oragnization Unit </b>}
                    name={[index, "branch"]}
                    rules={[
                      { required: true, message: "Branch Unit is required" },
                    ]}
                  >
                    <Input
                      value={branch.branch}
                      onChange={(e) => {
                        const updated = [...branchInstances];
                        updated[index].branch = e.target.value;
                        setBranchInstances(updated);
                      }}
                      placeholder="Branch Unit"
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
                    label={<b>Email Id</b>}
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
                    label={<b>Country</b>}
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
                    label={<b>State/Province</b>}
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
                    label={<b>City</b>}
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
                    label={<b>Postal Code</b>}
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
          <Box display="flex" justifyContent="flex-end" mt="10px" gap="10px">
            {/* <Button
              type="dashed"
              onClick={handleAddBranch}
              style={{ padding: "8px 16px", borderRadius: 8, fontWeight: 600 }}
            >
              + Add Branch
            </Button> */}
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
