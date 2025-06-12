import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  useTheme,
  useMediaQuery,
  // MenuItem,
  // Menu,
  // Typography,
  // Checkbox,
  // FormControlLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import {
  Search as SearchIcon,
  // FilterList as FilterIcon,
  // ImportExport as ImportExportIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import { first } from "lodash";

// Initial ticket data
// const initialTickets = [
//   { id: 1, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "Wipro" },
//   { id: 2, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", customermanager: "RamBabu", organization: "Infosys" },
//   { id: 3, name: "Rambabu bade", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "TCS" },
//   { id: 4, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "HCL" },
//   { id: 5, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "Tech Mahindra" },
//   { id: 6, name: "John Doe", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", Organization: "HCL" },
//   { id: 7, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "Infosys" },
//   { id: 8, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "Wipro" },
//   { id: 9, name: "John Doe", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode:"+91", customermanager:"RamBabu", organization: "TCS" },
// ];

// Columns for DataGrid
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
    field: "phone",
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
  {
    field: "creater",
    headerName: "Created",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
];

const Cm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();
  const [originalTickets, setOriginalTickets] = useState([]); // State to store the original data
  const [filteredTickets, setFilteredTickets] = useState([]);

  // State for tickets
  // const [tickets] = useState(initialTickets); // Removed setTickets since it's unused
  // const [filteredTickets, setFilteredTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  // const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  // const [selectedFilters, setSelectedFilters] = useState({ priority: [], status: [] });

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
          `${process.env.REACT_APP_API_URL}/v1/getAllCm`
        );
        const data = await response.json();
        if (response.ok && Array.isArray(data.data)) {
          const transformedData = data.data.map((item) => ({
            id: item.cmid || "N/A",
            name: `${item.firstname || ""} ${item.lastname || ""}`.trim(),
            firstname: item.firstname || "N/A",
            lastname: item.lastname || "N/A",
            phonecode: item.phonecode || "N/A",
            mobile: item.mobile || "N/A",
            email: item.email || "N/A",
            organizationid: item.organizationid || "N/A",
            organizationname: item.organizationname || "N/A",
            branch: item.branch || "N/A",
            crmid: item.crmid || "N/A",
            crmname: item.crmname || "N/A",
            gender: item.extraind2 || "N/A",
            status: item.extraind3 || "N/A",
            state: item.extraind4 || "N/A",
            city: item.extraind5 || "N/A",
            creater: item.adminid
              ? item.createrrole + item.createrid
              : item.hobid
              ? item.createrrole + item.createrid
              : item.crmid
              ? item.createrrole + item.createrid
              : item.createrrole,
            postalcode: item.extraind6 || "N/A",
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

  // Open & Close Filter Menu
  // const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  // const handleFilterClose = () => setFilterAnchorEl(null);

  // Handle Filter Selection
  // const handleFilterSelect = (filterType, value) => {
  //   setSelectedFilters((prev) => {
  //     const updatedFilters = { ...prev };
  //     updatedFilters[filterType] = updatedFilters[filterType].includes(value)
  //       ? updatedFilters[filterType].filter((item) => item !== value)
  //       : [...updatedFilters[filterType], value];
  //     applyFilters(searchTerm, updatedFilters);
  //     return updatedFilters;
  //   });
  // };

  // Apply Filters
  // const applyFilters = (search, filters) => {
  //   let filtered = tickets;
  //   if (search.trim()) {
  //     filtered = filtered.filter((ticket) =>
  //       Object.values(ticket).some((value) =>
  //         String(value).toLowerCase().includes(search.toLowerCase())
  //       )
  //     );
  //   }
  //   if (filters.priority.length) {
  //     filtered = filtered.filter((ticket) => filters.priority.includes(ticket.priority));
  //   }
  //   if (filters.status.length) {
  //     filtered = filtered.filter((ticket) => filters.status.includes(ticket.status));
  //   }
  //   setFilteredTickets(filtered);
  // };

  const handleNewTicket = () => {
    Navigate("/cmform");
  };

  const handleRowClick = (params) => {
    Navigate("/cmdetails", { state: { ticket: params.row } });
  };

  // Get Unique Values for Filters
  // const getUniqueValues = (key) => [...new Set(tickets.map((ticket) => ticket[key]))];

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

        {/* Export Button */}
        {/* <Button 
         sx={{
          backgroundColor: colors.blueAccent[500],
          color: "#ffffff",
          whiteSpace: "nowrap",
          fontWeight: "bold",
        }}
          variant="contained" 
          startIcon={<ImportExportIcon />} 
          onClick={() => alert("Export Data!")}
        >
          Export
        </Button> */}

        {/* Filter Button */}
        {/* <Button           
                  sx={{
                    backgroundColor: colors.blueAccent[500],
                    color: "#ffffff",
                    whiteSpace: "nowrap",
                    fontWeight: "bold",
                      textTransform:"none"
                  }}
          variant="contained" 
          startIcon={<FilterIcon />} 
          onClick={handleFilterClick}
        >
          Filter
        </Button> */}
        <Button
          variant="contained"
          sx={{
            background: colors.blueAccent[500],
            fontWeight: "bold",
            color: "#ffffff",
            whiteSpace: "nowrap",
            // paddingX: "15px"
            // padding: "12px 18px ",
            // fontSize: "14px",
            textTransform: "none",
          }}
          startIcon={<AddIcon />}
          onClick={handleNewTicket}
        >
          Create New
        </Button>

        {/* Filter Menu */}
        {/* <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
          <Box p={2}>
            <Typography variant="h6">Priority</Typography>
            {getUniqueValues("priority").map((priority) => (
              <MenuItem key={priority}>
                <FormControlLabel
                  control={<Checkbox checked={selectedFilters.priority.includes(priority)} onChange={() => handleFilterSelect("priority", priority)} />}
                  label={priority}
                />
              </MenuItem>
            ))}
          </Box>

          <Box p={2}>
            <Typography variant="h6">Status</Typography>
            {getUniqueValues("status").map((status) => (
              <MenuItem key={status}>
                <FormControlLabel
                  sx={{ backgroundColor: "#ffffff" }}
                  control={<Checkbox checked={selectedFilters.status.includes(status)} onChange={() => handleFilterSelect("status", status)} />}
                  label={status}
                />
              </MenuItem>
            ))}
          </Box>
        </Menu> */}
      </Box>

      {/* DataGrid */}
      <Box
        height="70vh"
        m="13px 0 0 0"
        sx={{
          overflowX: "hidden",
          // "& .MuiDataGrid-root": {
          //   border: "none",
          //   overflowX: "auto", // Enable horizontal scrolling
          // },
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
            scrollbarWidth: "none !important", // Hides scrollbar in Firefox
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
          rows={filteredTickets}
          columns={columns}
          pageSize={10}
          // rowsPerPageOptions={[10, 25, 50]} // Add this to include 10 in the options
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
};
export default Cm;
