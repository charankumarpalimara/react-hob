import {
  Box,
  useMediaQuery,
  Typography,
  Button,
  useTheme,
  TextField,
  Autocomplete,
  IconButton,
  Modal,
} from "@mui/material";
import { Formik } from "formik";
import { tokens } from "../../theme";
import * as yup from "yup";
import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import download from "downloadjs";
import { DataGrid } from "@mui/x-data-grid";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListNumbered,
  FormatListBulleted,
  InsertPhoto,
  TableChart,
  YouTube,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Youtube from "@tiptap/extension-youtube";
import { Underline } from "@tiptap/extension-underline";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";

// const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || (window.location.hostname === "localhost"
//   ? "http://localhost:8080"
//   : "http://161.35.54.196:8080");

// const WS_URL = process.env.REACT_APP_WS_URL || (window.location.hostname === "localhost"
//   ? "ws://localhost:8080"
//   : "ws://161.35.54.196:8080");

const initialTickets = [
  {
    id: 1,
    name: "Charan Palemala",
    status: "Pending",
    description: "this is not available",
    priority: "Urgent",
    ticketraise: "create a task 1",
    taskid: "1",
    date: "03-04-2025",
    time: "10:00 AM",
  },
  {
    id: 2,
    name: "Charan Palemala",
    status: "Pending",
    description: "this is not available",
    priority: "Urgent",
    ticketraise: "create a task 2",
    taskid: "2",
    date: "03-04-2025",
    time: "10:00 AM",
  },
  {
    id: 3,
    name: "Charan Palemala",
    status: "Pending",
    description: "this is not available",
    priority: "Urgent",
    ticketraise: "create a task 3",
    taskid: "3",
    date: "03-04-2025",
    time: "10:00 AM",
  },
  {
    id: 4,
    name: "Charan Palemala",
    status: "Pending",
    description: "this is not available",
    priority: "Urgent",
    ticketraise: "create a task 4",
    taskid: "4",
    date: "03-04-2025",
    time: "10:00 AM",
  },
  {
    id: 5,
    name: "Charan Palemala",
    status: "Pending",
    description: "this is not available",
    priority: "Urgent",
    ticketraise: "create a ticket",
    taskid: "5",
    date: "03-04-2025",
    time: "10:00 AM",
  },
  // { id: 6, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket", taskid: "6", date: "03-04-2025", time: "10:00 AM" },
  // { id: 7, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket", taskid: "7", date: "03-04-2025", time: "10:00 AM" },
  // { id: 8, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket", taskid: "8", date: "03-04-2025", time: "10:00 AM" },
  // { id: 9, name: "Charan Palemala", status: "Pending", description: "this is not available", priority: "Urgent", ticketraise: "create a ticket", taskid: "9", date: "03-04-2025", time: "10:00 AM" },
];

const TicketDetails = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const isMobile = useMediaQuery("(max-width:484px)");
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  // const [isEditingsection2, setIsEditingsection2] = useState(false);
  const navigate = useNavigate();
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [shareEntireExperience, setshareEntireExperience] = useState(false);
  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);

  const getExperienceColor = (experience) => {
    switch (experience) {
      case "Frustrated":
        return "#E64A19";
      case "Extremely Frustrated":
        return "#D32F2F";
      case "Happy":
        return "#FBC02D";
      case "Extremely Happy":
        return "#388E3C";
      default:
        return "#616161";
    }
  };

  const handleFormSubmit = (values) => {
    const fullPhoneNumber = `${values.phoneCode}${values.PhoneNo}`;
    console.log("Form Data:", { ...values, fullPhoneNumber });
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.4,
      headerClassName: "bold-header",
      disableColumnMenu: false,
      minWidth: 100,
    },
    {
      field: "ticketraise",
      headerName: "Task name",
      flex: 1,
      headerClassName: "bold-header",
      disableColumnMenu: true,
      minWidth: 200,
    },
    {
      field: "name",
      headerName: "Task owner",
      flex: 1,
      headerClassName: "bold-header",
      disableColumnMenu: true,
      minWidth: 150,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "bold-header",
      disableColumnMenu: true,
      minWidth: 150,
    },
    {
      field: "actions",
      headerName: "Action",
      flex: 1,
      headerClassName: "bold-header",
      disableColumnMenu: true,
      minWidth: 150,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={handleCompleteTask(params.id)}
            sx={{
              color: "#ffffff",
              backgroundColor: "#0BDA51",
              width: "30px",
              height: "30px",
            }}
            aria-label="complete"
            disableRipple
          >
            <CheckIcon />
          </IconButton>
          <IconButton
            onClick={handleDeleteTask(params.id)}
            sx={{
              color: "#ffffff",
              backgroundColor: "#FF2C2C",
              width: "30px",
              height: "30px",
            }}
            disableRipple
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  const initialValues = {
    organizationid: ticket.organizationid || "",
    organization: ticket.organization || "",
    cmname: ticket.cmname || "",
    experience: ticket.experience || "",
    branch: ticket.branch || "",
    priority: ticket.priority || "",
    crmname: ticket.crmname || "",
    status: ticket.status || "",
    department: ticket.department || "",
    date: ticket.date || "",
    time: ticket.time || "",
    subject: ticket.subject || "",
    requestdetails: ticket.requestdetails || "",
    phoneCode: ticket.phoneCode || "",
    PhoneNo: ticket.PhoneNo || "",
    notes: ticket.notes || "",
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
    PhoneNo: yup
      .string()
      .matches(/^[0-9]+$/, "Only numbers are allowed")
      .min(10, "Must be at least 10 digits")
      .required("Required"),
    notes: yup.string(),
  });

  const fileUrl =
    "https://upload.wikimedia.org/wikipedia/commons/4/4d/sample.jpg";
  const filename = "sample-file.jpg";

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      download(blob, filename);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log("Selected file:", file.name);
    }
  };



useEffect(() => {
  console.log("Ticket object:", ticket); // Debug
  const fetchMessages = async () => {
    if (!ticket.experienceid || !ticket.crmid) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/getChatMessages?experienceid=${ticket.experienceid}&crmid=${ticket.crmid}`
      );
      const data = await res.json();
      if (Array.isArray(data.messages)) {
        setMessages(data.messages.map(msg => ({
          text: msg.messege || msg.message,
          sender: msg.sender,
          time: msg.time
        })));
      }
    } catch (error) {
      setMessages([{ text: "Failed to load messages.", sender: "support", time: "" }]);
    }
  };
  fetchMessages();
}, [ticket.experienceid, ticket.crmid]);

  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "support" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline, // Add this line
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube,
    ],
    content: newMessage,
    onUpdate: ({ editor }) => {
      setNewMessage(editor.getHTML());
    },
  });

  const addImage = () => {
    const url = window.prompt("Enter the URL of the image:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = () => {
    const url = window.prompt("Enter YouTube URL:");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      });
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: 3,
        cols: 3,
        withHeaderRow: true,
      })
      .run();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: "user",
      },
    ]);
    setNewMessage("");
    editor.commands.clearContent();

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "We've received your message with attachments!",
          sender: "support",
        },
      ]);
    }, 1000);
  };

  const createtaskmodel = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isDesktop ? "60%" : "90%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const assignmodel = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isDesktop ? "40%" : "90%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const handleRowClick = (params) => {
    navigate("/taskdetails", { state: { ticket: params.row } });
  };

  const handleCompleteTask = (id) => (event) => {
    event.stopPropagation();
    console.log("Task completed:", id);
    // Add your complete task logic here
  };

  const handleDeleteTask = (id) => (event) => {
    event.stopPropagation();
    console.log("Task deleted:", id);
    // Add your delete task logic here
  };

  const TaskForm = ({ handleClose }) => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery("(max-width:600px)");
    const colors = tokens(theme.palette.mode);

    const handleFormSubmit = (values) => {
      console.log("Form Data:", values);
      alert("Task created successfully!");
      handleClose();
    };

    const initialValues = {
      taskname: "",
      taskowner: "",
      description: "",
      priority: "",
    };

    const checkoutSchema = yup.object().shape({
      taskname: yup.string().required("Required"),
      taskowner: yup.string().required("Required"),
      description: yup.string().required("Required"),
      priority: yup.string().required("Required"),
    });

    // const textFieldStyles = {
    //   "& .MuiOutlinedInput-root": {
    //     borderRadius: "8px",
    //     border: "1px solid #ccc",
    //     backgroundColor: "#ffffff",
    //     boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
    //     "&:hover": {
    //       borderColor: "#999",
    //       boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.15)",
    //     },
    //     padding: "8px 12px",
    //     height: "50px",
    //   },
    //   "& .MuiInputLabel-root": {
    //     color: "#555",
    //   },
    //   "& .MuiOutlinedInput-notchedOutline": {
    //     border: "none",
    //   },
    // };

    const priorityOptions = ["Urgent", "High", "Low"];

    // Columns for DataGrid

    return (
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
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns={
                  isNonMobile
                    ? "repeat(1, minmax(0, 1fr))"
                    : "repeat(3, minmax(0, 1fr))"
                }
                sx={{
                  "& > div": { gridColumn: isNonMobile ? "span 1" : undefined },
                  backgroundColor: "#ffffff",
                  marginTop: "20px",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Task Name"
                  name="taskname"
                  value={values.taskname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.taskname && !!errors.taskname}
                  helperText={touched.taskname && errors.taskname}
                  sx={{ ...textFieldStyles, gridColumn: "span 1" }}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Task Owner"
                  name="taskowner"
                  value={values.taskowner}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.taskowner && !!errors.taskowner}
                  helperText={touched.taskowner && errors.taskowner}
                  sx={{ ...textFieldStyles, gridColumn: "span 1" }}
                />

                <Autocomplete
                  fullWidth
                  options={priorityOptions}
                  value={values.priority || null}
                  onChange={(event, newValue) => {
                    setFieldValue("priority", newValue || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Priority"
                      sx={textFieldStyles}
                      error={!!touched.priority && !!errors.priority}
                      helperText={touched.priority && errors.priority}
                    />
                  )}
                  sx={{
                    gridColumn: "span 1",
                    "& .MuiAutocomplete-listbox": {
                      maxHeight: "200px",
                      padding: 0,
                      "& .MuiAutocomplete-option": {
                        minHeight: "32px",
                        padding: "4px 16px",
                      },
                    },
                  }}
                  freeSolo
                  forcePopupIcon
                  popupIcon={<ArrowDropDownIcon />}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="Description"
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                  multiline
                  rows={4}
                  sx={{
                    ...textFieldStyles,
                    gridColumn: "span 3",
                    "& .MuiOutlinedInput-root": {
                      ...textFieldStyles["& .MuiOutlinedInput-root"],
                      height: "auto",
                      minHeight: "120px",
                      alignItems: "flex-start",
                    },
                  }}
                />
              </Box>

              <Box display="flex" justifyContent="flex-end" mt="20px" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => setOpenTaskModal(false)}
                  sx={{
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                    transition: "0.3s",
                    backgroundColor: colors.redAccent[300],
                    color: "#ffffff",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: colors.redAccent[700],
                      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  Cancel
                </Button>
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
                    "&:hover": {
                      backgroundColor: colors.blueAccent[600],
                      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  Create Task
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };

  // Assign to Customer Relationship Manager

  const AssignCrm = ({ handleClose }) => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery("(max-width:600px)");
    const colors = tokens(theme.palette.mode);

    const handleFormSubmit = (values) => {
      console.log("Form Data:", values);
      alert("Task created successfully!");
      handleClose();
    };

    const initialValues = {
      crmids: "",
      crmname: "",
    };

    const checkoutSchema = yup.object().shape({
      crmids: yup.string().required("Required"),
      crmname: yup.string().required("Required"),
    });

    const crmids = ["123456", "123456", "123456", "123456", "123456"];

    // Columns for DataGrid

    return (
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
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns={
                  isNonMobile
                    ? "repeat(1, minmax(0, 1fr))"
                    : "repeat(1, minmax(0, 1fr))"
                }
                sx={{
                  "& > div": { gridColumn: isNonMobile ? "span 1" : undefined },
                  backgroundColor: "#ffffff",
                  marginTop: "20px",
                }}
              >
                <Autocomplete
                  fullWidth
                  options={crmids}
                  value={values.crmids || null}
                  onChange={(event, newValue) => {
                    setFieldValue("priority", newValue || "");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select CRM ID"
                      sx={textFieldStyles}
                      error={!!touched.crmids && !!errors.crmids}
                      helperText={touched.crmids && errors.crmids}
                    />
                  )}
                  sx={{
                    gridColumn: "span 1",
                    "& .MuiAutocomplete-listbox": {
                      maxHeight: "200px",
                      padding: 0,
                      "& .MuiAutocomplete-option": {
                        minHeight: "32px",
                        padding: "4px 16px",
                      },
                    },
                  }}
                  freeSolo
                  forcePopupIcon
                  popupIcon={<ArrowDropDownIcon />}
                />

                <TextField
                  fullWidth
                  variant="outlined"
                  label="CRM Name"
                  name="crmname"
                  value={values.crmname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.crmname && !!errors.crmname}
                  helperText={touched.crmname && errors.crmname}
                  sx={{ ...textFieldStyles, gridColumn: "span 1" }}
                  disabled
                />
              </Box>

              <Box display="flex" justifyContent="flex-end" mt="20px" gap={2}>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => setshareEntireExperience(false)}
                  sx={{
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                    transition: "0.3s",
                    backgroundColor: colors.redAccent[300],
                    color: "#ffffff",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: colors.redAccent[700],
                      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  Cancel
                </Button>
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
                    "&:hover": {
                      backgroundColor: colors.blueAccent[600],
                      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  Assign
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    );
  };

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

  const customerManagers = [
    "Rambabu",
    "Charan",
    "Lakshman",
    "Satya dev",
    "Ram",
  ];

  const priority = ["Urgent", "High", "Low"];

  const status = ["Pending", "Processing", "Closed"];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, 1fr)",
        },
        gap: 3,
        p: 2,
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      {/* First Column - Ticket Details */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: isDesktop ? 3 : 2,
          borderRadius: "8px",
          gridColumn: {
            xs: "1 / -1",
            md: "1 / 2",
          },
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={checkoutSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            setFieldValue,
            touched,
            errors,
            handleBlur,
            handleChange,
          }) => (
            <form>
              <Box
                display="grid"
                gap={2}
                gridTemplateColumns={{
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
              >
                {/* Ticket Details Fields */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Experience ID
                  </Typography>
                  <Typography>{values.id}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Organization
                  </Typography>
                  <Typography>{values.organization}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Branch
                  </Typography>
                  <Typography>{values.branch}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Customer Manager
                  </Typography>
                  <Typography>{values.cmname}</Typography>
                </Box>

                {isEditing ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#555", fontWeight: "bold" }}
                    >
                      Customer Relationship Manager
                    </Typography>
                    <Autocomplete
                      fullWidth
                      options={customerManagers}
                      value={values.crmname || null}
                      onChange={(event, newValue) => {
                        setFieldValue("crmname", newValue || "");
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{
                            display: isEditing ? "block" : "none",
                            "& .MuiInputBase-root": {
                              height: "40px",
                            },
                          }}
                          error={!!touched.crmname && !!errors.crmname}
                          helperText={touched.crmname && errors.crmname}
                          disabled={!isEditing}
                        />
                      )}
                      disabled={!isEditing}
                      sx={{
                        gridColumn: "span 1",
                        "& .MuiAutocomplete-listbox": {
                          maxHeight: "200px",
                          padding: 0,
                          "& .MuiAutocomplete-option": {
                            minHeight: "32px",
                            padding: "4px 16px",
                          },
                        },
                      }}
                      freeSolo
                      forcePopupIcon
                      popupIcon={<ArrowDropDownIcon />}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#555", fontWeight: "bold" }}
                    >
                      Customer Relationship Manager
                    </Typography>
                    <Typography>{values.crmname}</Typography>
                  </Box>
                )}

                {isEditing ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#555",
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
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
                            "& .MuiInputBase-root": {
                              height: "40px",
                            },
                          }}
                          error={!!touched.priority && !!errors.priority}
                          helperText={touched.priority && errors.priority}
                          disabled={!isEditing}
                        />
                      )}
                      disabled={!isEditing}
                      sx={{
                        gridColumn: "span 1",
                        "& .MuiAutocomplete-listbox": {
                          maxHeight: "200px",
                          padding: 0,
                          "& .MuiAutocomplete-option": {
                            minHeight: "32px",
                            padding: "4px 16px",
                          },
                        },
                      }}
                      freeSolo
                      forcePopupIcon
                      popupIcon={<ArrowDropDownIcon />}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#555", fontWeight: "bold" }}
                    >
                      Priority
                    </Typography>
                    <Typography
                      sx={{ color: getExperienceColor(values.priority) }}
                    >
                      {values.priority}
                    </Typography>
                  </Box>
                )}

                {isEditing ? (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "#555",
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
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
                            "& .MuiInputBase-root": {
                              height: "40px",
                            },
                          }}
                          error={!!touched.status && !!errors.status}
                          helperText={touched.status && errors.status}
                          disabled={!isEditing}
                        />
                      )}
                      disabled={!isEditing}
                      sx={{
                        gridColumn: "span 1",
                        "& .MuiAutocomplete-listbox": {
                          maxHeight: "200px",
                          padding: 0,
                          "& .MuiAutocomplete-option": {
                            minHeight: "32px",
                            padding: "4px 16px",
                          },
                        },
                      }}
                      freeSolo
                      forcePopupIcon
                      popupIcon={<ArrowDropDownIcon />}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#555", fontWeight: "bold" }}
                    >
                      Status
                    </Typography>
                    <Typography
                      sx={{ color: getExperienceColor(values.priority) }}
                    >
                      {values.status}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Date
                  </Typography>
                  <Typography>{values.date}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Time
                  </Typography>
                  <Typography>{values.time}</Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Experience
                  </Typography>
                  <Typography
                    sx={{ color: getExperienceColor(values.experience) }}
                  >
                    {values.experience}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Impact
                  </Typography>
                  <Typography>{values.department}</Typography>
                </Box>

                <Box
                  sx={{
                    gridColumn: { xs: "auto", sm: "span 2", md: "span 3" },
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: "#555", fontWeight: "bold" }}
                  >
                    Subject
                  </Typography>
                  <Typography>{values.subject}</Typography>
                </Box>
              </Box>

              <Box
                sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}
              >
                {/* Request Details Section */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "#555", fontWeight: "bold" }}
                    >
                      Request Details
                    </Typography>
                  </Box>
                  <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                    {values.requestdetails}
                  </Typography>
                </Box>

                {/* File Upload Section */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    borderRadius: 1,
                    width: "fit-content",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                    position: "relative",
                    overflow: "hidden",
                    border: "1px solid #ccc",
                  }}
                >
                  <Box
                    component="label"
                    htmlFor="fileInput"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      width="20"
                      height="20"
                      fill="#555"
                      style={{ marginRight: "8px" }}
                    >
                      <path d="M64 480H296.2C305.1 491.8 317.3 502.3 329.7 511.3C326.6 511.7 323.3 512 320 512H64C28.65 512 0 483.3 0 448V64C0 28.65 28.65 0 64 0H220.1C232.8 0 245.1 5.057 254.1 14.06L369.9 129.9C378.9 138.9 384 151.2 384 163.9V198.6C372.8 201.8 362.1 206 352 211.2V192H240C213.5 192 192 170.5 192 144V32H64C46.33 32 32 46.33 32 64V448C32 465.7 46.33 480 64 480V480zM347.3 152.6L231.4 36.69C229.4 34.62 226.8 33.18 224 32.48V144C224 152.8 231.2 160 240 160H351.5C350.8 157.2 349.4 154.6 347.3 152.6zM448 351.1H496C504.8 351.1 512 359.2 512 367.1C512 376.8 504.8 383.1 496 383.1H448V431.1C448 440.8 440.8 447.1 432 447.1C423.2 447.1 416 440.8 416 431.1V383.1H368C359.2 383.1 352 376.8 352 367.1C352 359.2 359.2 351.1 368 351.1H416V303.1C416 295.2 423.2 287.1 432 287.1C440.8 287.1 448 295.2 448 303.1V351.1zM576 368C576 447.5 511.5 512 432 512C352.5 512 288 447.5 288 368C288 288.5 352.5 224 432 224C511.5 224 576 288.5 576 368zM432 256C370.1 256 320 306.1 320 368C320 429.9 370.1 480 432 480C493.9 480 544 429.9 544 368C544 306.1 493.9 256 432 256z" />
                    </svg>
                    <Typography variant="body2">
                      {selectedFile ? selectedFile.name : "Attach Files"}
                    </Typography>
                  </Box>
                  <input
                    id="fileInput"
                    type="file"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      cursor: "pointer",
                      fontSize: 0,
                    }}
                    onChange={handleFileChange}
                  />
                </Box>

                {/* Download Button */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    disabled={isDownloading}
                    onClick={handleDownload}
                    sx={{ minWidth: 180 }}
                  >
                    {isDownloading ? "Downloading..." : "Download Attachment"}
                  </Button>
                </Box>

                {/* Task Fields */}

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      borderRadius: "8px",
                      boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                      transition: "0.3s",
                      backgroundColor: colors.redAccent[400],
                      color: "#ffffff",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: colors.redAccent[500],
                        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    Delete
                  </Button>

                  {isEditing ? (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setIsEditing(false)}
                        sx={{
                          padding: "12px 24px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.2)",
                          transition: "0.3s",
                          backgroundColor: colors.redAccent[400],
                          color: "#ffffff",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: colors.redAccent[500],
                            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
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
                          "&:hover": {
                            backgroundColor: colors.blueAccent[600],
                            boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.3)",
                          },
                        }}
                      >
                        Save
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setIsEditing(true)}
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
                      Edit
                    </Button>
                  )}
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {/* Second Column - Customer Support */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: isDesktop ? 3 : 2,
          borderRadius: "8px",
          gridColumn: {
            xs: "1 / -1",
            md: "2 / 3",
          },
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Chat Section */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            minHeight: isMobile ? "550px" : "",
            maxHeight: isMobile ? "600px" : "620px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
            {" "}
            Discussions
          </Typography>
          <Typography sx={{ mb: 2, color: colors.grey[600] }}>
            Discuss with Customer Support
          </Typography>

          {/* Messages Display */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: "4px",
              p: 2,
              mb: 2,
              border: "1px solid #ddd",
              overflowY: "auto",
              minHeight: "200px",
              maxHeight: "800px",
            }}
          >
            {messages.map((message, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: colors.grey[600] }}>
                  {message.sender === "manager" ? "Manager" : "Support"}
                </Typography>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor:
                      message.sender === "manager"
                        ? colors.blueAccent[100]
                        : "#f0f0f0",
                    display: "inline-block",
                  }}
                  dangerouslySetInnerHTML={{ __html: message.text }}
                />
              </Box>
            ))}
          </Box>

          {/* Tiptap Editor */}
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              // flexGrow: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Toolbar */}
            {editor && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  p: 1,
                  borderBottom: `1px solid ${colors.grey[300]}`,
                  flexWrap: "wrap",
                }}
              >
                <IconButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  color={editor.isActive("bold") ? "primary" : "default"}
                  size="small"
                >
                  <FormatBold fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  color={editor.isActive("italic") ? "primary" : "default"}
                  size="small"
                >
                  <FormatItalic fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  color={editor.isActive("underline") ? "primary" : "default"}
                  size="small"
                >
                  <FormatUnderlined fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  color={editor.isActive("bulletList") ? "primary" : "default"}
                  size="small"
                >
                  <FormatListBulleted fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  color={editor.isActive("orderedList") ? "primary" : "default"}
                  size="small"
                >
                  <FormatListNumbered fontSize="small" />
                </IconButton>

                <IconButton onClick={addImage} size="small">
                  <InsertPhoto fontSize="small" />
                </IconButton>

                <IconButton onClick={addTable} size="small">
                  <TableChart fontSize="small" />
                </IconButton>

                <IconButton onClick={addYoutubeVideo} size="small">
                  <YouTube fontSize="small" />
                </IconButton>
              </Box>
            )}

            {/* Editor Content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                overflow: "scroll",
                height: "250px",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  minHeight: "100px",
                  maxHeight: "100px",
                  "& .tiptap": {
                    minHeight: "200px",
                    outline: "none",
                    "& p": {
                      margin: 0,
                      marginBottom: "0.5em",
                    },
                  },
                }}
              >
                <EditorContent editor={editor} />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            maxHeight: "100px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: "#ffffff",
              "&:hover": { backgroundColor: colors.blueAccent[600] },
              textTransform: "none",
              minWidth: "100px",
            }}
          >
            Send
          </Button>
        </Box>
      </Box>

      {/* Third Column - Task Management */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: isDesktop ? 3 : 2,
          borderRadius: "8px",
          gridColumn: "1 / -1", // This makes it span all columns
          mt: { xs: 3, md: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "flex-end",
            mb: 2,
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              background: colors.blueAccent[500],
              fontWeight: "bold",
              color: "#ffffff",
              whiteSpace: "nowrap",
              textTransform: "none",
              // width: isMobile ? "60%" : "100%",
              "&:hover": {
                backgroundColor: colors.blueAccent[600],
              },
            }}
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskModal(true)}
          >
            Create New Task
          </Button>
        </Box>

        <Box
          height="39vh"
          m="13px 0 0 0"
          sx={{
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
              fontSize: "16px",
              whiteSpace: "nowrap",
              overflow: "visible",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
              fontWeight: "bold !important",
              fontSize: "16px !important",
              color: "#ffffff",
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold !important",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "#ffffff",
            },
            "& .MuiDataGrid-root::-webkit-scrollbar": {
              display: "none !important",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
              display: "none !important",
            },
            "& .MuiDataGrid-root": {
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#D9EAFD",
              },
            },
            "& .MuiDataGrid-row": {
              borderBottom: `0.5px solid ${colors.grey[300]}`,
              "&:hover": {
                cursor: "pointer",
                backgroundColor: "#D9EAFD",
              },
            },
            "& .MuiTablePagination-root": {
              color: "#ffffff !important",
            },
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
              color: "#ffffff !important",
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#ffffff !important",
            },
            "& .MuiSvgIcon-root": {
              color: "#ffffff !important",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
              color: "#ffffff",
            },
          }}
        >
          <DataGrid
            sx={{
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
                fontSize: "16px",
                whiteSpace: "nowrap", // Prevent text wrapping
                overflow: "visible", // Prevent text truncation
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none", // Remove the border below the header
                fontWeight: "bold !important",
                fontSize: "16px !important",
                color: "#ffffff",
              },
              // "& .MuiDataGrid-root::-webkit-scrollbar-thumb":{
              //    width: "2px !important",
              //    height: "6px !important"
              //  },
              "& .MuiDataGrid-columnSeparator": {
                display: "none", // Hide the column separator
              },
              // "& .MuiDataGrid-root::-webkit-scrollbar": {
              //   display: "none", // Hides scrollbar in Chrome, Safari
              // },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "bold !important", // Ensure header text is bold
              },
              // "& .MuiDataGrid-virtualScroller": {
              //   backgroundColor: "#ffffff",
              // },
              "& .MuiDataGrid-root::-webkit-scrollbar": {
                display: "none !important",
              },
              "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
                display: "none !important",
              },
              "& .MuiDataGrid-root": {
                // scrollbarWidth: "none !important", // Hides scrollbar in Firefox
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#D9EAFD",
                },
              },
              "& .MuiDataGrid-virtualScroller": {
                // scrollbarWidth: "none !important",
                backgroundColor: "#ffffff",
              },
              "& .MuiDataGrid-row": {
                borderBottom: `0.5px solid ${colors.grey[300]}`, // Add border to the bottom of each row
                "&:hover": {
                  cursor: "pointer",
                  backgroundColor: "#D9EAFD",
                },
              },
              "& .MuiTablePagination-root": {
                color: "#ffffff !important", // Ensure pagination text is white
              },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input":
                {
                  color: "#ffffff !important", // Ensure select label and input text are white
                },
              "& .MuiTablePagination-displayedRows": {
                color: "#ffffff !important", // Ensure displayed rows text is white
              },
              "& .MuiSvgIcon-root": {
                color: "#ffffff !important", // Ensure pagination icons are white
              },
              "& .MuiDataGrid-footerContainer": {
                display: "none",
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
                color: "#ffffff",
              },
            }}
            rows={initialTickets}
            columns={columns}
            // pageSize={10}
            onRowClick={handleRowClick}
          />
        </Box>

        {/* <Box sx={{marginTop:"20px", margin:"15px"}}>  
          <hr  />
        </Box> */}

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            mb: 2,
            gap: 2,
            marginTop: "20px",
          }}
        >
          {/* <Button
            variant="contained"
            sx={{
              background: colors.blueAccent[500],
              fontWeight: "bold",
              color: "#ffffff",
              whiteSpace: "nowrap",
              textTransform: "none",
              padding:"14px 25px", 
              // width: isMobile ? "60%" : "100%",
              '&:hover': {
                backgroundColor: colors.blueAccent[600],
              }
            }}
            // startIcon={<AddIcon />}
            onClick={() => setshareEntireExperience(true)}
          >
            Assign To
          </Button> */}
        </Box>
        <Modal
          open={openTaskModal}
          onClose={() => setOpenTaskModal(false)}
          aria-labelledby="task-modal-title"
          aria-describedby="task-modal-description"
        >
          <Box sx={createtaskmodel}>
            <Typography
              id="task-modal-title"
              variant="h5"
              component="h2"
              sx={{ mb: 3 }}
            >
              Create New Task
            </Typography>
            <TaskForm handleClose={() => setOpenTaskModal(false)} />
          </Box>
        </Modal>

        <Modal
          open={shareEntireExperience}
          onClose={() => setshareEntireExperience(false)}
          aria-labelledby="task-modal-title"
          aria-describedby="task-modal-description"
        >
          <Box sx={assignmodel}>
            <Typography
              id="task-modal-title"
              variant="h5"
              component="h2"
              sx={{ mb: 3 }}
            >
              Assign To Customer Relationship Manager
            </Typography>
            <AssignCrm handleClose={() => setshareEntireExperience(false)} />
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default TicketDetails;
