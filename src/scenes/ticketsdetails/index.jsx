

import {
  Box,
  useMediaQuery,
  Typography,
  Button,
  useTheme,
  // TextField,
  // Autocomplete,
  // IconButton,
} from "@mui/material";
import { Formik } from "formik";
import { tokens } from "../../theme";
import * as yup from "yup";
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import download from "downloadjs";
import { Table } from "antd";
import {
//   FormatBold,
//   FormatItalic,
//   FormatUnderlined,
//   FormatListNumbered,
//   FormatListBulleted,
  InsertPhoto,
//   TableChart,
//   YouTube,
//   Check as CheckIcon,
//   Delete as DeleteIcon,
  // Add as AddIcon,
} from "@mui/icons-material";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Image from "@tiptap/extension-image";
// import TableRow from "@tiptap/extension-table-row";
// import TableHeader from "@tiptap/extension-table-header";
// import TableCell from "@tiptap/extension-table-cell";
// import Youtube from "@tiptap/extension-youtube";
// import { Underline } from "@tiptap/extension-underline";
// import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

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
];

// const customerManagers = [
//   "Rambabu",
//   "Charan",
//   "Lakshman",
//   "Satya dev",
//   "Ram",
// ];
// const priority = ["Urgent", "High", "Low"];
// const status = ["Pending", "Processing", "Closed"];

const TicketDetails = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery("(min-width:600px)");
  const isMobile = useMediaQuery("(max-width:484px)");
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const navigate = useNavigate();

  // All hooks must be called before any return!
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // const [isEditing, setIsEditing] = useState(false);
  // const [openTaskModal, setOpenTaskModal] = useState(false);
  // const [shareEntireExperience, setshareEntireExperience] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", sender: "support" },
  ]);
  // const [newMessage, setNewMessage] = useState("");

  const ticket = useMemo(() => location.state?.ticket || {}, [location.state]);



  // Chat fetch
  useEffect(() => {
    const fetchMessages = async () => {
      if (!ticket.experienceid || !ticket.crmid) return;
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getChatMessages?experienceid=${ticket.experienceid}&crmid=${ticket.crmid}`
        );
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((msg) => ({
              text: msg.messege || msg.message,
              sender: msg.sender,
              time: msg.time,
            }))
          );
        }
      } catch (error) {
        setMessages([
          { text: "Failed to load messages.", sender: "support", time: "" },
        ]);
      }
    };
    fetchMessages();
  }, [ticket]);

  // Tiptap Editor
  // const editor = useEditor({
  //   extensions: [
  //     StarterKit,
  //     Underline,
  //     Image.configure({ inline: true, allowBase64: true }),
  //     TableRow,
  //     TableHeader,
  //     TableCell,
  //     Youtube,
  //   ],
  //   content: newMessage,
  //   onUpdate: ({ editor }) => setNewMessage(editor.getHTML()),
  // });


    if (!ticket || Object.keys(ticket).length === 0) {
    return <Typography color="error">No ticket data found.</Typography>;
  }

  // Table columns
  const antColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "Task name",
      dataIndex: "ticketraise",
      key: "ticketraise",
      width: 200,
    },
    {
      title: "Task owner",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
    },

  ];

  // Helpers
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

  // Formik
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

  // File download/upload
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

  // Chat send
  // const handleSendMessage = () => {
  //   if (!newMessage.trim()) return;
  //   setMessages((prev) => [
  //     ...prev,
  //     { text: newMessage, sender: "user" },
  //   ]);
  //   setNewMessage("");
  //   editor.commands.clearContent();
  //   setTimeout(() => {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         text: "We've received your message with attachments!",
  //         sender: "support",
  //       },
  //     ]);
  //   }, 1000);
  // };

  // Tiptap toolbar actions
  // const addImage = () => {
  //   const url = window.prompt("Enter the URL of the image:");
  //   if (url) {
  //     editor.chain().focus().setImage({ src: url }).run();
  //   }
  // };
  // const addYoutubeVideo = () => {
  //   const url = window.prompt("Enter YouTube URL:");
  //   if (url) {
  //     editor.commands.setYoutubeVideo({
  //       src: url,
  //       width: 640,
  //       height: 480,
  //     });
  //   }
  // };
  // const addTable = () => {
  //   editor
  //     .chain()
  //     .focus()
  //     .insertTable({
  //       rows: 3,
  //       cols: 3,
  //       withHeaderRow: true,
  //     })
  //     .run();
  // };

  // Table row click
  const handleRowClick = (params) => {
    navigate("/taskdetails", { state: { ticket: params.row } });
  };

  // Styles
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

  // Render
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
      {/* Ticket Details */}
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
          onSubmit={() => {}}
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
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Experience ID
                  </Typography>
                  <Typography>{values.id}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Organization
                  </Typography>
                  <Typography>{values.organization}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Branch
                  </Typography>
                  <Typography>{values.branch}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Customer Manager
                  </Typography>
                  <Typography>{values.cmname}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Customer Relationship Manager
                  </Typography>
                  <Typography>{values.crmname}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Priority
                  </Typography>
                  <Typography sx={{ color: getExperienceColor(values.priority) }}>
                    {values.priority}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Status
                  </Typography>
                  <Typography sx={{ color: getExperienceColor(values.priority) }}>
                    {values.status}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Date
                  </Typography>
                  <Typography>{values.date}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Time
                  </Typography>
                  <Typography>{values.time}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Experience
                  </Typography>
                  <Typography sx={{ color: getExperienceColor(values.experience) }}>
                    {values.experience}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Impact
                  </Typography>
                  <Typography>{values.department}</Typography>
                </Box>
                <Box sx={{ gridColumn: { xs: "auto", sm: "span 2", md: "span 3" } }}>
                  <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
                    Subject
                  </Typography>
                  <Typography>{values.subject}</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Request Details Section */}
                <Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="subtitle2" sx={{ color: "#555", fontWeight: "bold" }}>
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
                  <Box component="label" htmlFor="fileInput" sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <InsertPhoto fontSize="small" sx={{ marginRight: "8px", color: "#555" }} />
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
              </Box>
            </form>
          )}
        </Formik>
      </Box>

      {/* Customer Support Chat */}
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
          {/* <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "4px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
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
                <IconButton onClick={() => editor.chain().focus().toggleBold().run()} color={editor.isActive("bold") ? "primary" : "default"} size="small">
                  <FormatBold fontSize="small" />
                </IconButton>
                <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} color={editor.isActive("italic") ? "primary" : "default"} size="small">
                  <FormatItalic fontSize="small" />
                </IconButton>
                <IconButton onClick={() => editor.chain().focus().toggleUnderline().run()} color={editor.isActive("underline") ? "primary" : "default"} size="small">
                  <FormatUnderlined fontSize="small" />
                </IconButton>
                <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} color={editor.isActive("bulletList") ? "primary" : "default"} size="small">
                  <FormatListBulleted fontSize="small" />
                </IconButton>
                <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()} color={editor.isActive("orderedList") ? "primary" : "default"} size="small">
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
            <Box sx={{ display: "flex", flexDirection: "row", overflow: "scroll", height: "250px" }}>
              <Box sx={{ flex: 1, p: 2, minHeight: "100px", maxHeight: "100px" }}>
                <EditorContent editor={editor} />
              </Box>
            </Box>
          </Box> */}
        </Box>
        {/* <Box sx={{ display: "flex", justifyContent: "flex-end", maxHeight: "100px" }}>
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
        </Box> */}
      </Box>

      {/* Task Management Table */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          p: isDesktop ? 3 : 2,
          borderRadius: "8px",
          gridColumn: "1 / -1",
          mt: { xs: 3, md: 0 },
        }}
      >
        {/* <Box
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
              "&:hover": {
                backgroundColor: colors.blueAccent[600],
              },
            }}
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskModal(true)}
          >
            Create New Task
          </Button>
        </Box> */}
        <Table
            className="custom-ant-table-header"
          columns={antColumns}
          dataSource={initialTickets}
          rowKey="id"
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick({ row: record }),
          })}
        />
      </Box>
    </Box>
  );
};

export default TicketDetails;