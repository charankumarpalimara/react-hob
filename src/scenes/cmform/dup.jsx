import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  Autocomplete,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import { Country } from "country-state-city";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import axios from "axios";
// import { Password } from "@mui/icons-material";

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
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(max-width:600px)");
  const colors = tokens(theme.palette.mode);
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
  const [crmId, setCrmId] = useState([]);
  // const [crmName, setCrmName] = useState([]);

  const handleFormSubmit = async (values) => {
    setIsLoading(true);
    console.log("Form submitted with values:", values);

    const formData = new FormData();
    formData.append("firstname", values.firstName);
    formData.append("lastname", values.lastName);
    formData.append("phonecode", values.phoneCode || "");
    formData.append("mobile", values.PhoneNo);
    formData.append("email", values.email);
    formData.append("gender", values.gender);
    formData.append("designation", values.designation);
    formData.append("organization", values.organization);
    formData.append("branch", values.branch);
    formData.append("username", values.email); // or another username field if you have one
    formData.append("crmId", values.crmid);
    formData.append("crmName", values.customerrelationshipmanagername);

    const sessionData = JSON.parse(sessionStorage.getItem("userDetails")); // replace with your actual key
    const createrrole = sessionData?.extraind10 || "";
    const createrid =
      sessionData?.adminid || sessionData?.crmid || sessionData?.hobid || "";
    const password = values.firstName + values.PhoneNo;
    formData.append("createrrole", createrrole);
    formData.append("createrid", createrid);
    console.log(createrrole);
    formData.append("passwords", password); // replace with actual password logic
    // Convert base64 image to Blob and append as file
    if (profileImage) {
      try {
        const blob = await fetch(profileImage).then((res) => res.blob());
        formData.append("cmimage", blob, "profileImage.jpg");
      } catch (error) {
        console.error("Error converting image to blob:", error);
      }
    } else {
      alert("Please upload a profile image.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/v1/createCm`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("CM Registered Successfully!");
      console.log("Form Data Submitted Successfully:", response.data);
      // Optionally, redirect or reset form here
    } catch (error) {
      alert("Error submitting form");
      console.error("Error submitting form data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}api/v1/getAllOrgs`
        );
        const data = await response.json();
        console.log("API Response:", data);
        if (response.ok) {
          if (Array.isArray(data.data)) {
            // Save all organization names in an array
            const orgNames = data.data.map(
              (item) => item.organizationname || "N/A"
            );
            setOrganizationNames(orgNames);
            console.log("Organization Names Array:", orgNames);
          } else {
            console.error("Unexpected data format:", data.data);
          }
        } else {
          console.error("Error fetching organizationname:", data.error);
        }
      } catch (error) {
        console.error("Error fetching organizationname:", error);
      }
    };
    fetchTickets();
  }, []);

  const fetchBranch = async (values) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}api/v1/getBranchbyOrganizationname/${values.organization}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);
        // Adjust according to your backend's response structure
        if (Array.isArray(data.branchDetails)) {
          setBranchNames(data.branchDetails);
          console.log("Branch Names Array:", data.branchDetails);
        } else if (typeof data.branchDetails === "string") {
          // If branchDetails is a single string, wrap in array
          setBranchNames([data.branchDetails]);
          console.log("Branch Name:", data.branchDetails);
        } else {
          console.error("Unexpected data format:", data);
        }
      } else {
        console.error("Error fetching branch:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching branch:", error);
    }
  };

  const fetchcrmid = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}api/v1/getCrmId`
      );
      if (response.ok) {
        const data = await response.json();
        // The backend returns { crmid: [ { crmid: "CRM_017" }, ... ] }
        if (Array.isArray(data.crmid)) {
          const crmidList = data.crmid.map((item) => item.crmid);
          setCrmId(crmidList);
          console.log("CrmId Array:", crmidList);
        } else {
          setCrmId([]);
          console.error("Unexpected crmid format:", data.crmid);
        }
      } else {
        setCrmId([]);
        console.error("Error fetching crmid:", response.statusText);
      }
    } catch (error) {
      setCrmId([]);
      console.error("Error fetching crmid:", error);
    }
  };

  // const fetchcrmname = async () => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/v1/getCrmNamebyId/${crmId}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       // The backend returns { crmid: [ { crmid: "CRM_017" }, ... ] }
  //       if (Array.isArray(data.crmNames)) {
  //         const crmNameList = data.crmNames.map(item => item.crmNames);
  //         crmName(crmNameList);
  //         console.log("CrmId Array:", crmNameList);
  //       } else {
  //         crmName([]);
  //         console.error("Unexpected crmname format:", data.crmNames);
  //       }
  //     } else {
  //       crmName([]);
  //       console.error("Error fetching crmname:", response.statusText);
  //     }
  //   } catch (error) {
  //     crmName([]);
  //     console.error("Error fetching crmname:", error);
  //   }
  // };

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
    if (!completedCrop || !imgRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

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
          if (!blob) {
            return;
          }
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

  const initialValues = {
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    designation: "",
    street: "",
    city: "",
    state: "",
    country: "",
    email: "",
    PhoneNo: "",
    organization: "",
    branch: "",
  };

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("Required"),
    middleName: yup.string(),
    lastName: yup.string().required("Required"),
    gender: yup.string().required("Required"),
    designation: yup.string().required("Required"),
    street: yup.string().required("Required"),
    city: yup.string().required("Required"),
    state: yup.string().required("Required"),
    country: yup.string().required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    PhoneNo: yup
      .string()
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(10, "Must be at least 10 digits")
      .required("Required"),
    organization: yup.string().required("Required"),
    branch: yup.string().required("Required"),
  });

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      border: "1px solid #ccc",
      backgroundColor: "#ffffff",
      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
      "&:hover": {
        borderColor: "#999",
        boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.15)",
      },
      padding: "8px 12px",
      height: "50px",
    },
    "& .MuiInputLabel-root": {
      color: "#555",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  };

  const countries = Country.getAllCountries();
  // const organization = ["Wipro", "Infosys", "TCS", "HCL", "Tech Mahindra"];
  const gender = ["Male", "Female"];
  // const branch = ["Branch 1", "Branch 2", "Branch 3", "Branch 4", "Branch 5"];

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
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              {/* Profile Photo Section */}
              <Box display="flex" justifyContent="center" mb="20px">
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={profileImage || "https://via.placeholder.com/150"}
                    sx={{
                      width: 120,
                      height: 120,
                      border: `2px solid ${colors.primary[500]}`,
                      cursor: "pointer",
                    }}
                    onClick={triggerFileInput}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      backgroundColor: colors.blueAccent[500],
                      "&:hover": {
                        backgroundColor: colors.blueAccent[600],
                      },
                    }}
                    onClick={triggerFileInput}
                  >
                    <PhotoCamera />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </Box>
              </Box>

              {/* Crop Modal */}
              <Dialog
                open={cropModalOpen}
                onClose={() => setCropModalOpen(false)}
                maxWidth="md"
              >
                <DialogTitle>Crop Profile Picture</DialogTitle>
                <DialogContent>
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
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setCropModalOpen(false)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveCroppedImage}
                    color="primary"
                    variant="contained"
                  >
                    Save
                  </Button>
                </DialogActions>
              </Dialog>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(3, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? "span 4" : undefined },
                  backgroundColor: "#ffffff",
                }}
              >
                {[
                  { label: "First Name", name: "firstName" },
                  { label: "Last Name", name: "lastName" },
                  { label: "Email Id", name: "email", type: "email" },
                ].map((field, index) => (
                  <TextField
                    key={index}
                    fullWidth
                    variant="outlined"
                    type={field.type || "text"}
                    label={field.label}
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched[field.name] && !!errors[field.name]}
                    helperText={touched[field.name] && errors[field.name]}
                    sx={{ ...textFieldStyles, gridColumn: "span 1" }}
                  />
                ))}

                <Box
                  sx={{ gridColumn: "span 1", display: "flex", gap: "10px" }}
                >
                  <Autocomplete
                    fullWidth
                    options={countries}
                    getOptionLabel={(option) =>
                      `+${option.phonecode} (${option.name})`
                    }
                    value={
                      countries.find(
                        (country) =>
                          `+${country.phonecode}` === values.phoneCode
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      setFieldValue(
                        "phoneCode",
                        newValue ? `+${newValue.phonecode}` : ""
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Phone Code"
                        sx={textFieldStyles}
                        error={!!touched.phoneCode && !!errors.phoneCode}
                        helperText={touched.phoneCode && errors.phoneCode}
                      />
                    )}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Phone No"
                    name="PhoneNo"
                    value={values.PhoneNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!touched.PhoneNo && !!errors.PhoneNo}
                    helperText={touched.PhoneNo && errors.PhoneNo}
                    sx={textFieldStyles}
                  />
                </Box>

                <Autocomplete
                  fullWidth
                  options={gender}
                  value={values.gender || null}
                  onChange={(event, newValue) => {
                    setFieldValue("gender", newValue || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gender"
                      sx={textFieldStyles}
                      error={!!touched.gender && !!errors.gender}
                      helperText={touched.gender && errors.gender}
                    />
                  )}
                  sx={{ gridColumn: "span 1" }}
                  freeSolo
                  forcePopupIcon
                  popupIcon={<ArrowDropDownIcon />}
                />

                {[{ label: "Designation", name: "designation" }].map(
                  (field, index) => (
                    <TextField
                      key={index}
                      fullWidth
                      variant="outlined"
                      type={field.type || "text"}
                      label={field.label}
                      name={field.name}
                      value={values[field.name]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={!!touched[field.name] && !!errors[field.name]}
                      helperText={touched[field.name] && errors[field.name]}
                      sx={{ ...textFieldStyles, gridColumn: "span 1" }}
                    />
                  )
                )}

                <Autocomplete
                  fullWidth
                  options={organizationNames}
                  value={values.organization || null}
                  onChange={async (event, newValue) => {
                    setFieldValue("organization", newValue || "");
                    if (newValue) {
                      await fetchBranch({ organization: newValue });
                      setFieldValue("branch", ""); // Reset branch when org changes
                    } else {
                      setBranchNames([]);
                      setFieldValue("branch", "");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Organization"
                      sx={textFieldStyles}
                      error={!!touched.organization && !!errors.organization}
                      helperText={touched.organization && errors.organization}
                    />
                  )}
                  sx={{ gridColumn: "span 1" }}
                  freeSolo
                  forcePopupIcon
                  popupIcon={<ArrowDropDownIcon />}
                />

                <Autocomplete
                  fullWidth
                  options={branchNames}
                  value={values.branch || null}
                  onChange={(event, newValue) => {
                    setFieldValue("branch", newValue || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Branch"
                      sx={textFieldStyles}
                      error={!!touched.branch && !!errors.branch}
                      helperText={touched.branch && errors.branch}
                    />
                  )}
                  sx={{ gridColumn: "span 1" }}
                  freeSolo
                  forcePopupIcon
                  popupIcon={<ArrowDropDownIcon />}
                />

                <Autocomplete
                  fullWidth
                  options={crmId}
                  value={values.crmid || null}
                  onOpen={fetchcrmid}
                  onChange={async (event, newValue) => {
                    setFieldValue("crmid", newValue || "");
                    if (newValue) {
                      try {
                        const response = await fetch(
                          `${process.env.REACT_APP_API_URL}api/v1/getCrmNamebyId/${newValue}`
                        );
                        if (response.ok) {
                          const data = await response.json();
                          setFieldValue(
                            "customerrelationshipmanagername",
                            data.crmNames || ""
                          );
                          setFieldValue(
                            "customerrelationshipmanagerheading",
                            data.crmHeading || ""
                          );
                        } else {
                          setFieldValue("customerrelationshipmanagername", "");
                          setFieldValue(
                            "customerrelationshipmanagerheading",
                            ""
                          );
                        }
                      } catch (error) {
                        setFieldValue("customerrelationshipmanagername", "");
                        setFieldValue("customerrelationshipmanagerheading", "");
                      }
                    } else {
                      setFieldValue("customerrelationshipmanagername", "");
                      setFieldValue("customerrelationshipmanagerheading", "");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer Manager Relationship Id"
                      sx={textFieldStyles}
                      error={!!touched.crmid && !!errors.crmid}
                      helperText={touched.crmid && errors.crmid}
                    />
                  )}
                  sx={{ gridColumn: "span 1" }}
                  freeSolo
                  forcePopupIcon
                  popupIcon={<ArrowDropDownIcon />}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Customer Relationship Manager Name"
                  name="customerrelationshipmanagername"
                  value={values.customerrelationshipmanagername}
                  onChange={handleChange}
                  disabled
                  onBlur={handleBlur}
                  error={
                    !!touched.customerrelationshipmanagername &&
                    !!errors.customerrelationshipmanagername
                  }
                  helperText={
                    touched.customerrelationshipmanagername &&
                    errors.customerrelationshipmanagername
                  }
                  sx={{ ...textFieldStyles, gridColumn: "span 1" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="text"
                  label="Customer Relationship Manager Heading"
                  name="customerrelationshipmanagerheading"
                  value={values.customerrelationshipmanagerheading}
                  onChange={handleChange}
                  disabled
                  onBlur={handleBlur}
                  error={
                    !!touched.customerrelationshipmanagerheading &&
                    !!errors.customerrelationshipmanagerheading
                  }
                  helperText={
                    touched.customerrelationshipmanagerheading &&
                    errors.customerrelationshipmanagerheading
                  }
                  sx={{ ...textFieldStyles, gridColumn: "span 1" }}
                />
              </Box>

              <Box display="flex" justifyContent="flex-end" mt="24px">
                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => {
                    handleFormSubmit(values);
                  }}
                  sx={{
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                    transition: "0.3s",
                    backgroundColor: colors.blueAccent[700],
                    color: "#ffffff",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: colors.blueAccent[600],
                      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  Create
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
};

export default CmForm;
