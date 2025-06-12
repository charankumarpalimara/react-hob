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
// import { Country } from "country-state-city";

// const initialTickets = [
//   { id: 1, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Wipro" },
//   { id: 2, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Infosys" },
//   { id: 3, name: "Rambabu bade", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "TCS" },
//   { id: 4, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "HCL" },
//   { id: 5, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Tech Mahindra" },
//   { id: 6, name: "John Doe", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", Organization: "HCL" },
//   { id: 7, name: "Charan Palemala", email: "charan@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Infosys" },
//   { id: 8, name: "Satya Narayana", email: "Satya@gmail.com", phone: "1234567890", city: "Visakhapatnam", created: "14th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "Wipro" },
//   { id: 9, name: "John Doe", email: "john@gmail.com", phone: "1234567890", city: "New York", created: "15th March, 2025", country: "India", state: "Andhra Pradesh", phoneno: "7386569469", phonenocode: "+91", address: "5448 Claudine Extension Suite 701", organization: "TCS" },
// ];

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
    headerName: "Organization",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 200,
  },
  {
    field: "mobile",
    headerName: "Phone",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
  {
    field: "district",
    headerName: "City",
    flex: 1,
    headerClassName: "bold-header",
    disableColumnMenu: true,
    minWidth: 150,
  },
  // { field: "branchtype", headerName: "Branch Type", flex: 1, headerClassName: "bold-header", disableColumnMenu: true, minWidth: 150 },
];

const Organization = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const Navigate = useNavigate();
  const [originalTickets, setOriginalTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (searchValue === "") {
      setFilteredTickets(originalTickets); // Reset to original data when search is cleared
    } else {
      const filtered = originalTickets.filter(
        (ticket) =>
          (ticket.id || "").toLowerCase().includes(searchValue) ||
          (ticket.name || "").toLowerCase().includes(searchValue) ||
          (ticket.city || "").toLowerCase().includes(searchValue) ||
          (ticket.mobile || "").toLowerCase().includes(searchValue)
      );
      setFilteredTickets(filtered);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/getAllOrgs`
        );
        const data = await response.json();
        console.log("API Response:", data);
        if (response.ok) {
          if (Array.isArray(data.data)) {
            const transformedData = data.data.map((item) => ({
              id: item.organizationid || "N/A",
              name: item.organizationname || "N/A",
              phonenocode: item.phonecode || "N/A",
              branchtype: item.branchtype || "N/A",
              brachname: item.branch || "N/A",
              phonecode: item.phonecode || "N/A",
              mobile: item.mobile || "N/A",
              email: item.email || "N/A",
              country: item.country || "N/A",
              state: item.state || "N/A",
              address: item.address || "N/A",
              postalcode: item.postalcode || "N/A",
              district: item.district || "N/A",
            }));
            setOriginalTickets(transformedData);
            setFilteredTickets(transformedData);
            console.log("Transformed Data:", transformedData);
          } else {
            console.error("Unexpected data format:", data.data);
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
      const newOrg = JSON.parse(event.data);
      console.log("Received WebSocket message:", newOrg);

      const transformedOrg = {
        id: newOrg.organizationid || "N/A",
        name: newOrg.organizationname || "N/A",
        phonenocode: newOrg.phonecode || "N/A",
        mobile: newOrg.mobile || "N/A",
        email: newOrg.email || "N/A",
        district: newOrg.district || "N/A",
      };

      setOriginalTickets((prev) => [transformedOrg, ...prev]);
      setFilteredTickets((prev) => [transformedOrg, ...prev]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = (event) => {
      console.warn("WebSocket closed:", event);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleNewTicket = () => {
    Navigate("/organizationform");
  };

  const handleRowClick = (params) => {
    Navigate("/organizationdetails", { state: { ticket: params.row } });
  };

  return (
    <Box m="10px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={2}
        mb={2}
        flexDirection={isMobile ? "column" : "row"}
      >
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
      <Box
        height="70vh"
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
            scrollbarWidth: "none !important",
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
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "#ffffff",
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
          rows={filteredTickets}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onRowClick={handleRowClick}
        />
      </Box>
    </Box>
  );
};
export default Organization;
