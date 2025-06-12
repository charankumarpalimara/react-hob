import { Box, useMediaQuery, Typography, Button, useTheme, TextField, Autocomplete } from "@mui/material";
import { Formik } from "formik";
import { tokens } from "../../theme";
import * as yup from "yup";
import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
// import download from 'downloadjs';
// import JoditEditor from 'jodit-react';
// import {Jodit} from 'jodit-pro';
import 'jodit-pro/es5/jodit.min.css';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import { Block } from "@mui/icons-material";
// import PhoneIcon from '@mui/icons-material/Phone';
// import EmailIcon from '@mui/icons-material/Email';
// import HelpIcon from '@mui/icons-material/Help';

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL 
// const WS_URL = process.env.REACT_APP_WS_URL || (window.location.hostname === "localhost"
//   ? "ws://localhost:8080"
//   : "ws://161.35.54.196:8080");

const TaskDetails = () => {
    const theme = useTheme();
    const isDesktop = useMediaQuery("(min-width:600px)");

    const location = useLocation();

    const [isEditing, setIsEditing] = useState(false);
    const colors = tokens(theme.palette.mode);

    const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);

    const getExperienceColor = (experience) => {
        switch (experience) {
            case "Frustrated": return "#E64A19";
            case "Extremely Frustrated": return "#D32F2F";
            case "Happy": return "#FBC02D";
            case "Extremely Happy": return "#388E3C";
            default: return "#616161";
        }
    };

    const handleFormSubmit = (values) => {
        const fullPhoneNumber = `${values.phoneCode}${values.PhoneNo}`;
        console.log("Form Data:", { ...values, fullPhoneNumber });
    };

    const initialValues = {
        taskid: ticket.taskid || "",
        priority: ticket.priority || "",
        ticketraise: ticket.ticketraise || "",
        description: ticket.description || "",
        name: ticket.name || "",
        status: ticket.status || "",
        date: ticket.date || "",
        time: ticket.time || "",
        id: ticket.id || "",
    };

    const checkoutSchema = yup.object().shape({
        organization: yup.string().required("Required"),
        cmname: yup.string().required("Required"),
        crmname: yup.string().required("Required"),
        status: yup.string().required("Required"),
        branch: yup.string().required("Required"),
        department: yup.string().required("Required"),
        date: yup.string().required("Required"),
        time: yup.string().required("Required"),
        subject: yup.string().required("Required"),
        phoneCode: yup.string().required("Required"),
        PhoneNo: yup.string()
            .matches(/^[0-9]+$/, "Only numbers are allowed")
            .min(10, "Must be at least 10 digits")
            .required("Required"),
        notes: yup.string(),
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


    // const config = {
    //   readonly: false,
    //   buttons: ['bold', 'italic', 'underline', 'strikethrough', '|', 'ul', 'ol', '|', 'link'],
    // };

    // Add these state variables at the top of your component

    const status = [
        "Pending",
        "Resolved",
        "In Progress",
        "Closed",

    ];


    const priority = [
        "Urgent",
        "High",
        "Low",
    ];
    return (
        <Box >
            {/* First Column - Ticket Details */}
            <Box sx={{
                backgroundColor: "#ffffff",
                p: isDesktop ? 3 : 2,
                borderRadius: "8px",
                flex: 1,
                maxWidth: "100%",
                width: "100%"
            }}>
                <Formik initialValues={initialValues} validationSchema={checkoutSchema} onSubmit={handleFormSubmit}>
                    {({ values, setFieldValue, touched, errors, handleBlur, handleChange, handleSubmit, }) => (
                        <form>
                            <Box
                                display="grid"
                                gap={4}
                                gridTemplateColumns={{
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(3, 1fr)"
                                }}
                            >
                                {/* Ticket Details Fields */}
                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>Task ID</Typography>
                                    <Typography>{values.id}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>Task Name</Typography>
                                    <Typography>{values.ticketraise}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>Task Owner Name</Typography>
                                    <Typography>{values.name}</Typography>
                                </Box>
                                {isEditing ? (
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold", marginBottom: "5px" }}>Description</Typography>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            // label="Description"
                                            name="description"
                                            value={values.description}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={!!touched.description && !!errors.description}
                                            helperText={touched.description && errors.description}
                                            multiline
                                            rows={4} // You can adjust this number to change the height
                                            disabled={!isEditing}
                                            sx={{
                                                ...textFieldStyles,
                                                gridColumn: "span 1",
                                                "& .MuiOutlinedInput-root": {
                                                    ...textFieldStyles["& .MuiOutlinedInput-root"],
                                                    height: "auto", // Override the fixed height
                                                    minHeight: "120px", // Set a minimum height
                                                    alignItems: "flex-start", // Align text to top
                                                    disabled: !isEditing
                                                }
                                            }}
                                        />
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold", marginBottom: "5px" }}>Description</Typography>
                                        <Typography>{values.description}</Typography>
                                    </Box>
                                )}
                                {/* <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>Customer Manager</Typography>
                  <Typography>{values.cmname}</Typography>
                </Box> */}

                                {isEditing ? (
                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                        <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                                            Status
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            options={status}
                                            value={values.status || null}
                                            onChange={(event, newValue) => {
                                                setFieldValue("status", newValue || "");
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    sx={{
                                                        display: isEditing ? "block" : "none",
                                                        '& .MuiInputBase-root': {  // Target the input container
                                                            height: '40px',          // Adjust input height
                                                        }
                                                    }}
                                                    error={!!touched.status && !!errors.status}
                                                    helperText={touched.status && errors.status}
                                                    disabled={!isEditing}
                                                />
                                            )}
                                            disabled={!isEditing}
                                            sx={{
                                                gridColumn: "span 1",
                                                '& .MuiAutocomplete-listbox': {  // Target the dropdown list
                                                    maxHeight: '200px',           // Set maximum height
                                                    padding: 0,                   // Remove default padding
                                                    '& .MuiAutocomplete-option': { // Target each option
                                                        minHeight: '32px',          // Reduce option height
                                                        padding: '4px 16px',        // Adjust padding
                                                    }
                                                }
                                            }}
                                            freeSolo
                                            forcePopupIcon
                                            popupIcon={<ArrowDropDownIcon />}
                                        />
                                    </Box>
                                ) : (
                                    <Box sx={{ gridColumn: { xs: "auto", sm: "span 2", md: "auto" } }}>
                                        <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>Status</Typography>
                                        <Typography>{values.status}</Typography>
                                    </Box>
                                )}
                                {isEditing ? (
                                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                                        <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold", marginBottom: "5px" }}>
                                            Priority
                                        </Typography>
                                        <Autocomplete
                                            fullWidth
                                            options={priority}
                                            value={values.priority || null}
                                            onChange={(event, newValue) => {
                                                setFieldValue("priority", newValue || "");
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    sx={{
                                                        display: isEditing ? "block" : "none",
                                                        '& .MuiInputBase-root': {  // Target the input container
                                                            height: '40px',          // Adjust input height
                                                        }
                                                    }}
                                                    error={!!touched.priority && !!errors.priority}
                                                    helperText={touched.priority && errors.priority}
                                                    disabled={!isEditing}
                                                />
                                            )}
                                            disabled={!isEditing}
                                            sx={{
                                                gridColumn: "span 1",
                                                '& .MuiAutocomplete-listbox': {  // Target the dropdown list
                                                    maxHeight: '200px',           // Set maximum height
                                                    padding: 0,                   // Remove default padding
                                                    '& .MuiAutocomplete-option': { // Target each option
                                                        minHeight: '32px',          // Reduce option height
                                                        padding: '4px 16px',        // Adjust padding
                                                    }
                                                }
                                            }}
                                            freeSolo
                                            forcePopupIcon
                                            popupIcon={<ArrowDropDownIcon />}
                                        />
                                    </Box>
                                ) : (
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>Priority</Typography>
                                        <Typography sx={{ color: getExperienceColor(values.priority) }}>{values.priority}</Typography>

                                    </Box>
                                )}


                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>Date</Typography>
                                    <Typography>{values.date}</Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>Time</Typography>
                                    <Typography>{values.time}</Typography>
                                </Box>




                            </Box>

                            <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                                {/* Request Details Section with Edit Functionality */}


                                {/* File Upload Section */}




                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>


        </Box>
    );
};

export default TaskDetails;