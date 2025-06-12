import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Columns for DataGrid
const columns = [
  {
    field: "hobid",
    headerName: "ID",
    flex: 0.4,
    headerClassName: "bold-header",
    disableColumnMenu: false,
    minWidth: 100,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 2,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 200,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
  {
    field: "totalNumber",
    headerName: "Phone",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
  {
    field: "city",
    headerName: "City",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
];

const Hob = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();

  // State for tickets
  const [originalTickets, setOriginalTickets] = useState([]); // State to store the original data
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Search filter
  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredTickets(originalTickets); // Reset to original data when search is cleared
    } else {
      const filtered = originalTickets.filter(
        (ticket) =>
          ticket.name.toLowerCase().includes(searchValue) ||
          ticket.email.toLowerCase().includes(searchValue) ||
          ticket.city.toLowerCase().includes(searchValue) ||
          ticket.mobile.toLowerCase().includes(searchValue)
      );
      setFilteredTickets(filtered);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllHob`
        );
        const data = await response.json();
        console.log("API Response:", data); // Log the entire API response
        if (response.ok) {
          if (Array.isArray(data.data)) {
            const transformedData = data.data.map((item) => ({
              hobid: item.hobid || "N/A", // Map hobid to id for unique row identification
              name: `${item.firstname || ""} ${item.lastname || ""}`.trim(),
              firstname: item.firstname || "N/A",
              lastname: item.lastname || "N/A",
              phonecode: item.phonecode || "N/A",
              mobile: item.mobile || "N/A",
              totalNumber: item.phonecode + " " + item.mobile,
              status: item.extraind6 || "N/A",
              email: item.email || "N/A",
              gender: item.extraind2 || "N/A",
              country: item.extraind3 || "N/A",
              state: item.extraind4 || "N/A",
              city: item.extraind5 || "N/A",
              imageUrl: `${item.imageUrl || ""}`,
            }));
            setOriginalTickets(transformedData); // Store the original data
            setFilteredTickets(transformedData); // Initialize filtered data
            console.log("Transformed Data:", transformedData); // Log transformed data
          } else {
            console.error("Unexpected data format:", data.data); // Log unexpected format
          }
        } else {
          console.error("Error fetching tickets:", data.error);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.onmessage = (event) => {
      const newHob = JSON.parse(event.data);
      console.log("Received WebSocket message:", newHob); // Debugging log

      // Ensure the new row has a unique `id` property and construct the `name` field
      const transformedHob = {
        ...newHob,
        id: newHob.hobid, // Map hobid to id
        name: `${newHob.firstname || ""} ${newHob.lastname || ""}`.trim(), // Construct name
      };

      setOriginalTickets((prev) => [transformedHob, ...prev]);
      setFilteredTickets((prev) => [transformedHob, ...prev]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket closed:", event);
    };

    return () => {
      ws.close(); // Clean up WebSocket connection
    };
  }, []);

  const handleNewTicket = () => {
    Navigate("/form");
  };

  const handleRowClick = (params) => {
    Navigate("/hobdetails", { state: { ticket: params.row } });
  };

  return (
    <Box m="10px">
      {/* Toolbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
        flexDirection={isMobile ? "column" : "row"}
      >
        {/* Search Bar */}
        <Box
          display="flex"
          backgroundColor="#ffffff"
          borderRadius="3px"
          flex={1}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          sx={{
            background: colors.blueAccent[500],
            fontWeight: "bold",
            color: "#ffffff",
            whiteSpace: "nowrap",
            textTransform: "none",
          }}
          startIcon={<AddIcon />}
          onClick={handleNewTicket}
        >
          Create New
        </Button>
      </Box>

      {/* DataGrid */}
      <Box
        height="70vh"
        m="13px 0 0 0"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            overflowX: "auto", // Enable horizontal scrolling
          },
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
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important", // Ensure header text is bold
          },
          "& .MuiDataGrid-virtualScroller": {
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
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
            color: "#ffffff !important", // Ensure select label and input text are white
          },
          "& .MuiTablePagination-displayedRows": {
            color: "#ffffff !important", // Ensure displayed rows text is white
          },
          "& .MuiSvgIcon-root": {
            color: "#ffffff !important", // Ensure pagination icons are white
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            color: "#ffffff",
          },
        }}
      >
        <DataGrid
          rows={filteredTickets}
          columns={columns}
          pageSize={10}
          // rowsPerPageOptions={[10, 25, 50]} // Add this to include 10 in the options
          getRowId={(row) => row.hobid} // Ensure unique row IDs
          onRowClick={handleRowClick}
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
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": {
              color: "#ffffff !important", // Ensure select label and input text are white
            },
            "& .MuiTablePagination-displayedRows": {
              color: "#ffffff !important", // Ensure displayed rows text is white
            },
            "& .MuiSvgIcon-root": {
              color: "#ffffff !important", // Ensure pagination icons are white
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
              color: "#ffffff",
            },
          }}
        />
      </Box>
    </Box>
  );
};
export default Hob;
