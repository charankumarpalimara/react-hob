import { Box, Button, TextField, useMediaQuery, useTheme, Autocomplete, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import React, { useState } from 'react';
import { Country, State, City } from 'country-state-city';
import { useLocation } from 'react-router-dom';
// import CrmDetails from "./dup";

const CrmDetails = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(max-width:600px)");
  const colors = tokens(theme.palette.mode); // Get theme colors
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const location = useLocation();
  const ticket = location.state?.ticket || {};

  const handleFormSubmit = (values) => {
    // Combine phone code and phone number
    const fullPhoneNumber = `${values.phoneCode}${values.PhoneNo}`;
    console.log("Form Data:", { ...values, fullPhoneNumber });
  };

  const initialValues = {
    firstName: ticket.name?.split(' ')[0] || "",
    middleName: ticket.name?.split(' ')[1] || "",
    lastName: ticket.name?.split(' ')[2] || "",
    designation: "",
    street: "",
    city: ticket.city || "",
    state: region || "",
    country: country || "",
    email: ticket.email || "",
    PhoneNo: ticket.phoneno || "",
    phoneCode:ticket.phonenocode || "",
    customerManager: ticket.customermanager || "", // New field for customer manager
  };

  const checkoutSchema = yup.object().shape({
    firstName: yup.string().required("Required"),
    middleName: yup.string(),
    lastName: yup.string().required("Required"),
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
    phoneCode: yup.string().required("Required"),
    customerManager: yup.string().required("Required"), // Validation for customer manager
  });

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
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
      border: "1px solid #ccc", // Ensure the border is visible
    },
  };

  // Get all countries
  const countries = Country.getAllCountries();

  // Get states based on selected country
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];

  // Get cities based on selected state
  const cities = selectedState ? City.getCitiesOfState(selectedCountry?.isoCode, selectedState.isoCode) : [];

  // Customer Manager options
  const customerManagers = [
    "Customer Manager 1",
    "Customer Manager 2",
    "Customer Manager 3",
    "Customer Manager 4",
    "Customer Manager 5",
  ];

  return (
    <Box m="15px" sx={{ backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px" }}>
      <Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleFormSubmit}>
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="20px"
              gridTemplateColumns={isNonMobile ? "repeat(1, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))"}
            >
              {/* First Name, Middle Name, Last Name, Designation */}
              {[
                { label: "First Name", name: "firstName" },
                { label: "Middle Name", name: "middleName" },
                { label: "Last Name", name: "lastName" },
                { label: "Email Id", name: "email", type: "email" },
                { label: "Designation", name: "designation" },
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
                  sx={{ ...textFieldStyles, gridColumn: "span 2" }}
                />
              ))}

              {/* Phone Code Dropdown */}
              <Autocomplete
                fullWidth
                options={countries}
                getOptionLabel={(option) => `+${option.phonecode} (${option.name})`}
                value={countries.find((country) => `+${country.phonecode}` === values.phoneCode) || null}
                onChange={(event, newValue) => {
                  setFieldValue("phoneCode", newValue ? `+${newValue.phonecode}` : "");
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
                sx={{ gridColumn: "span 1" }}
              />

              {/* Phone Number Input */}
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
                sx={{ ...textFieldStyles, gridColumn: "span 1" }}
              />

              {/* Country Dropdown */}
              <Autocomplete
                fullWidth
                options={countries}
                getOptionLabel={(option) => option.name}
                value={selectedCountry}
                onChange={(event, newValue) => {
                  setSelectedCountry(newValue);
                  setSelectedState(null); // Reset state when country changes
                  setSelectedCity(null); // Reset city when country changes
                  setFieldValue("country", newValue ? newValue.name : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    sx={textFieldStyles}
                    error={!!touched.country && !!errors.country}
                    helperText={touched.country && errors.country}
                  />
                )}
                sx={{ gridColumn: "span 2" }}
              />

              {/* State Dropdown */}
              <Autocomplete
                fullWidth
                options={states}
                getOptionLabel={(option) => option.name}
                value={selectedState}
                onChange={(event, newValue) => {
                  setSelectedState(newValue);
                  setSelectedCity(null); // Reset city when state changes
                  setFieldValue("state", newValue ? newValue.name : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="State"
                    sx={textFieldStyles}
                    error={!!touched.state && !!errors.state}
                    helperText={touched.state && errors.state}
                    disabled={!selectedCountry}
                  />
                )}
                sx={{ gridColumn: "span 2" }}
                disabled={!selectedCountry}
              />

              {/* City Dropdown */}
              <Autocomplete
                fullWidth
                options={cities}
                getOptionLabel={(option) => option.name}
                value={selectedCity}
                onChange={(event, newValue) => {
                  setSelectedCity(newValue);
                  setFieldValue("city", newValue ? newValue.name : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    sx={textFieldStyles}
                    error={!!touched.city && !!errors.city}
                    helperText={touched.city && errors.city}
                    disabled={!selectedState}
                  />
                )}
                sx={{ gridColumn: "span 2" }}
                disabled={!selectedState}
              />

              {/* Customer Manager Dropdown */}
              <FormControl fullWidth sx={{ gridColumn: "span 2", ...textFieldStyles }}>
                <InputLabel>Customer Manager</InputLabel>
                <Select
                  name="customerManager"
                  value={values.customerManager}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Customer Manager"
                >
                  <MenuItem value="" disabled>
                    Select Customer Manager
                  </MenuItem>
                  {customerManagers.map((manager, index) => (
                    <MenuItem key={index} value={manager}>
                      {manager}
                    </MenuItem>
                  ))}
                </Select>
                {touched.customerManager && errors.customerManager && (
                  <p style={{ color: "red", fontSize: "12px" }}>{errors.customerManager}</p>
                )}
              </FormControl>
            </Box>

            <Box display="flex" justifyContent="flex-end" mt="24px">
              <Button
                type="submit"
                variant="contained"
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
                  "&:hover": { backgroundColor: colors.blueAccent[600], boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)" },
                }}
              >
                Create
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CrmDetails;