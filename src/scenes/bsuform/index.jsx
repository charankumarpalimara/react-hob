import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Header from "../../components/Header";

const BsuForm = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const theme = useTheme();

  const handleFormSubmit = (values) => {
    console.log(values);
  };

  return (
    <Box m="20px">
      <Header title="CREATE HOB" subtitle="Create a New Business of The Unit Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/** Reusable TextField Styling */}
              {[
                { label: "First Name", name: "firstName" },
                { label: "Middle Name", name: "middleName" },
                { label: "Last Name", name: "lastName" },
                { label: "Account(s)", name: "account" },
                { label: "Designation", name: "designation" },
                { label: "Street", name: "street" },
                { label: "City", name: "city" },
                { label: "State", name: "state" },
                { label: "Country", name: "country" },
                { label: "Email Id", name: "email" },
                { label: "Country Code", name: "countryCode" },
                { label: "Contact Number", name: "contact" },
              ].map((field, index) => (
                <TextField
                  key={index}
                  fullWidth
                  variant="outlined"
                  type="text"
                  label={field.label}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values[field.name]}
                  name={field.name}
                  error={!!touched[field.name] && !!errors[field.name]}
                  helperText={touched[field.name] && errors[field.name]}
                  sx={{
                    gridColumn: "span 2",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      border: `1px solid ${theme.palette.mode === "dark" ? "#555" : "#ccc"}`,
                      backgroundColor: theme.palette.mode === "dark" ? "#1f2a40" : "#ffffff",
                      boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        borderColor: theme.palette.mode === "dark" ? "#888" : "#999",
                        boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.15)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.mode === "dark" ? "#bbb" : "#555",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      border: "none",
                    },
                  }}
                />
              ))}
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Customer Manager
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Required"),
  address1: yup.string().required("Required"),
  address2: yup.string().required("Required"),
});

const initialValues = {
  firstName: "",
  middleName: "",
  lastName: "",
  account: "",
  designation: "",
  street: "",
  city: "",
  state: "",
  country: "",
  email: "",
  countryCode: "",
  contact: "",
  address1: "",
  address2: "",
};

export default BsuForm;
