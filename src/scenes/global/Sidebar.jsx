import { useState, useEffect } from "react";
import { Box, useTheme, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
// import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useNavigate } from "react-router-dom";
import logoLight from "./logo.png";

// Shared getActivePage function
const getActivePage = (pathname) => {
  if (pathname.includes("/crm") || pathname.includes("/crmform") || pathname.includes("/crmdetails")) {
    return "/crm";
  } else if (pathname.includes("/cm") || pathname.includes("/cmform") || pathname.includes("/cmdetails")) {
    return "/cm";
  } else if (pathname.includes("/hob") || pathname.includes("/form") || pathname.includes("/hobdetails")) {
    return "/hob";
  } else if (pathname.includes("/notes")) {
    return "/notes";
  }else if (pathname.includes("/tasks") || pathname.includes("/taskform") ) {
    return "/tasks";
  }
   else if (pathname.includes("/calendar")) {
    return "/calendar";
  }
  else if (pathname.includes("/organization") || pathname.includes("/organizationdetails")) {
    return "/organization";
  }  else if (
    pathname === "/" ||
    pathname.includes("/allExperiences") ||
    pathname.includes("/ticketdetails") ||
    pathname.includes("/newExperiences") ||
    pathname.includes("/pendingExperiences") ||
    pathname.includes("/taskdetails") ||
    pathname.includes("/profile") ||
    pathname.includes("/resolvedExperiences")
  ) {
    return "/"; // Dashboard is active for these routes
  } else {
    return pathname;
  }
};

// Sidebar Item Component
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <ListItem
      button
      component={Link}
      to={to}
      selected={selected === to}
      onClick={() => {
        setSelected(to);
        sessionStorage.setItem("selectedSidebarItem", to);
      }}
      sx={{
        color: selected === to ? "white" : colors.blueAccent[500],
        fontWeight: selected === to ? "bold" : "regular",
        backgroundColor: selected === to ? colors.blueAccent[700] : "inherit",
        borderRadius: "10px",
        marginBottom: "8px",
        "&:hover": {
          backgroundColor: selected === to ? "#3e4396 !important" : "none", // Ensure no hover effect
          color: selected === to ? "white" : colors.blueAccent[500],
        },
      }}
    >
      <ListItemIcon sx={{ color: "inherit" }}>{icon}</ListItemIcon>
      <ListItemText
        primary={title}
        sx={{
          "& .MuiTypography-root": { // Target the nested Typography component
            fontWeight: "bold !important", // Ensure text is bold for selected item
            fontSize: "13px",
          },
        }}
      />
    </ListItem>
  );
};

// Sidebar Component
const Sidebar = ({ isSidebar, onLogout }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const isMobile = useMediaQuery("(max-width: 900px)");
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState(getActivePage(location.pathname));

  useEffect(() => {
    setSelected(getActivePage(location.pathname));
    sessionStorage.setItem("selectedSidebarItem", location.pathname);
  }, [location.pathname]);

  const logoSrc = logoLight;

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    onLogout(); // Call the logout function from props
    // window.location.reload(); // Reload the page to reset the state
    navigate('/login'); // Navigate to login page

  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        // width: "260px", // Increased width from 270px to 300px
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: "265px", // Increased width from 270px to 300px
          boxSizing: "border-box",
          background: colors.primary[500],
        },
      }}
    >
      {/* Sidebar Logo */}
      <Box
        alignItems="center"
        sx={{
          width: "100%",
          padding: "20px",
          background: "#ffffff",
          boxShadow: "0px 4px 4px -2px rgba(0, 0, 0, 0.1)",
          paddingBottom: 1,

        }}
      >
        <img src={logoSrc} alt="logo" style={{ width: "100%", cursor: "pointer" }} />
      </Box>

      {/* Menu Items */}
      <List sx={{ padding: "20px" }}>
        <Item title="Dashboard" to="/" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />
        <Item title="Customer Manager" to="/cm" icon={<PeopleAltOutlinedIcon />} selected={selected} setSelected={setSelected} />
        <Item
          title="Customer Relationship Manager"
          to="/crm"
          icon={<HandshakeOutlinedIcon />}
          selected={selected}
          setSelected={setSelected}
        />
       <Item title="Head of the Business" to="/hob" icon={<StorefrontOutlinedIcon />} selected={selected} setSelected={setSelected} />
        <Item title="Organization" to="/organization" icon={<BusinessOutlinedIcon />} selected={selected} setSelected={setSelected} />
        {/* <Item title="Tasks" to="/tasks" icon={<TaskOutlinedIcon />} selected={selected} setSelected={setSelected} /> */}
        <Item title="Notes" to="/notes" icon={<DescriptionOutlinedIcon />} selected={selected} setSelected={setSelected} />
        <Item title="Calendar" to="/calendar" icon={<CalendarTodayOutlinedIcon />} selected={selected} setSelected={setSelected} />
        
              <ListItem
                    button
                    onClick={handleLogout}
                    sx={{
                      color: colors.blueAccent[500],
                      borderRadius: "10px",
                      marginBottom: "8px",

                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      <LogoutOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Logout"

                      sx={{
                        "& .MuiTypography-root": {
                          fontWeight: "bold !important", // Ensure text is bold for selected item
                          fontSize: "13px",
                
                        },
                      }}
                    />
                  </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;