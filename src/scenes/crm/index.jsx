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
import {
  Search as SearchIcon,
  Add as AddIcon,
  // PostAdd,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import { first } from "lodash";

// Columns for DataGrid
const columns = [
  {
    field: "crmid",
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
    field: "mobile",
    headerName: "Mobile",
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
  {
    field: "date",
    headerName: "Created",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
];

const Crm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();
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
          `${process.env.REACT_APP_API_URL}/v1/getAllCrm`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          const transformedData = data.data.map((item) => ({
            crmid: item.crmid || "N/A",
            name: `${item.firstname || ""} ${item.lastname || ""}`.trim(),
            firstname: item.firstname || "N/A",
            lastname: item.lastname || "N/A",
            phonecode: item.phonecode || "N/A",
            mobile: item.mobile || "N/A",
            email: item.email || "N/A",
            gender: item.extraind2 || "N/A",
            country: item.extraind3 || "N/A",
            state: item.extraind4 || "N/A",
            city: item.extraind5 || "N/A",
            postalcode: item.extraind6 || "N/A",
            status: item.extraind7 || "N/A",
            date: item.date || "N/A",
            time: item.time || "N/A",
            imageUrl: `${item.imageUrl || ""}`,
          }));
          setOriginalTickets(transformedData);
          setFilteredTickets(transformedData);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();

    const connectWebSocket = () => {
      const ws = new WebSocket(process.env.REACT_APP_WS_URL);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const newCrm = JSON.parse(event.data);
        console.log("Received WebSocket message:", newCrm); // Debugging log

        // Ensure the new row has a unique `id` property and construct the `name` field
        const transformedCrm = {
          ...newCrm,
          crmid: newCrm.crmid, // Map crmid to id
          name: `${newCrm.firstname || ""} ${newCrm.lastname || ""}`.trim(), // Construct name
        };

        setOriginalTickets((prev) => [transformedCrm, ...prev]);
        setFilteredTickets((prev) => [transformedCrm, ...prev]);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = (event) => {
        console.warn("WebSocket closed. Reconnecting in 5 seconds...", event);
        setTimeout(connectWebSocket, 5000); // Attempt reconnection after 5 seconds
      };

      return ws;
    };

    const ws = connectWebSocket();

    return () => {
      ws.close(); // Clean up WebSocket connection
    };
  }, []);

  const handleNewTicket = () => {
    Navigate("/crmform");
  };

  const handleRowClick = (params) => {
    Navigate("/crmdetails", { state: { ticket: params.row } });
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
          overflowX: "hidden",
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
          "& .MuiDataGrid-columnSeparator": {
            display: "none", // Hide the column separator
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold !important", // Ensure header text is bold
          },
          "& .MuiDataGrid-root::-webkit-scrollbar": {
            display: "none !important",
          },
          "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
            display: "none !important",
          },
          "& .MuiDataGrid-root": {
            scrollbarWidth: "none !important", // Hides scrollbar in Firefox
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
          getRowId={(row) => row.crmid} // Use `crmid` as the unique identifier
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
            "& .MuiDataGrid-columnSeparator": {
              display: "none", // Hide the column separator
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold !important", // Ensure header text is bold
            },
            "& .MuiDataGrid-root::-webkit-scrollbar": {
              display: "none !important",
            },
            "& .MuiDataGrid-virtualScroller::-webkit-scrollbar": {
              display: "none !important",
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
        />
      </Box>
    </Box>
  );
};

export default Crm;
