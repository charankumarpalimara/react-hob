import { Box, Button, TextField, useMediaQuery, useTheme, Autocomplete } from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import { Country, State, City } from "country-state-city";
import React, { useState } from "react";

const OrganizationForm = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(max-width:600px)");
  const colors = tokens(theme.palette.mode);
  
  // State for multiple form instances
  const [formInstances, setFormInstances] = useState([{ id: 1, country: null, state: null, city: null }]);

  const handleAddForm = (values) => {
    setFormInstances([...formInstances, { id: formInstances.length + 1, country: null, state: null, city: null }]);
  };

  const handleRemoveForm = (id) => {
    setFormInstances(formInstances.filter((form) => form.id !== id));
  };

  const handleFormSubmit = (values) => {
    console.log("Form Data:", values);
  };

  const initialValues = {
    organization: "",
    email: "",
    phoneCode: "",
    phoneno: "",
    country: "",
    province: "",
    city: "",
    postcode: "",
    branch: "",
  };

  const validationSchema = yup.object().shape({
    organization: yup.string().required("Required"),
    email: yup.string().email("Invalid email").required("Required"),
    phoneCode: yup.string().required("Required"),
    phoneno: yup.string().required("Required"),
    country: yup.string().required("Required"),
    province: yup.string().required("Required"),
    city: yup.string().required("Required"),
    postcode: yup.string().required("Required"),
    branch: yup.string(),
  });

  return (
    <Box m="15px" sx={{ backgroundColor: "#ffffff", padding: "20px" }}>
      {formInstances.map((instance, index) => (
        <Formik
          key={instance.id}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns={isNonMobile ? "repeat(1, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))"}
                sx={{ backgroundColor: "#ffffff" }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Organization Name"
                  name="organization"
                  value={values.organization}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.organization && !!errors.organization}
                  helperText={touched.organization && errors.organization}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  type="email"
                  label="Email Id"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Branch"
                  name="branch"
                  value={values.branch}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.branch && !!errors.branch}
                  helperText={touched.branch && errors.branch}
                />

                {/* Country Dropdown */}
                <Autocomplete
                  fullWidth
                  options={Country.getAllCountries()}
                  getOptionLabel={(option) => option.name}
                  value={instance.country}
                  onChange={(event, newValue) => {
                    const updatedInstances = [...formInstances];
                    updatedInstances[index].country = newValue;
                    updatedInstances[index].state = null;
                    updatedInstances[index].city = null;
                    setFormInstances(updatedInstances);
                    setFieldValue("country", newValue ? newValue.name : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      error={!!touched.country && !!errors.country}
                      helperText={touched.country && errors.country}
                    />
                  )}
                />

                {/* State/Province Dropdown */}
                <Autocomplete
                  fullWidth
                  options={instance.country ? State.getStatesOfCountry(instance.country.isoCode) : []}
                  getOptionLabel={(option) => option.name}
                  value={instance.state}
                  onChange={(event, newValue) => {
                    const updatedInstances = [...formInstances];
                    updatedInstances[index].state = newValue;
                    updatedInstances[index].city = null;
                    setFormInstances(updatedInstances);
                    setFieldValue("province", newValue ? newValue.name : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State/Province"
                      error={!!touched.province && !!errors.province}
                      helperText={touched.province && errors.province}
                      disabled={!instance.country}
                    />
                  )}
                />

                {/* City Dropdown */}
                <Autocomplete
                  fullWidth
                  options={
                    instance.state ? City.getCitiesOfState(instance.country?.isoCode, instance.state.isoCode) : []
                  }
                  getOptionLabel={(option) => option.name}
                  value={instance.city}
                  onChange={(event, newValue) => {
                    const updatedInstances = [...formInstances];
                    updatedInstances[index].city = newValue;
                    setFormInstances(updatedInstances);
                    setFieldValue("city", newValue ? newValue.name : "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      error={!!touched.city && !!errors.city}
                      helperText={touched.city && errors.city}
                      disabled={!instance.state}
                    />
                  )}
                />
              </Box>

              {/* Add More & Remove Buttons */}
              <Box sx={{ display: "flex", gap: "10px", justifyContent: "center", mt: "16px" , m:"20px" }}>
                {index === formInstances.length - 1 && (
                  <Button
                    variant="contained"
                    onClick={() => handleAddForm(values)}
                    sx={{ backgroundColor: colors.blueAccent[700], color: "#ffffff", textTransform: "none" }}
                  >
                    Add More
                  </Button>
                )}
                {formInstances.length > 1 && (
                  <Button variant="contained" color="error" onClick={() => handleRemoveForm(instance.id)}>
                    Remove
                  </Button>
                )}
              </Box>
            </form>
          )}
        </Formik>
      ))}

      {/* Create Button - Only One at the Bottom */}
      <Box display="flex" justifyContent="flex-end" mt="24px">
        <Button type="submit" variant="contained" sx={{ backgroundColor: colors.blueAccent[700], color: "#ffffff" }}>
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default OrganizationForm;
