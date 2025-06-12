import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, Box, useMediaQuery } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { ThemeProvider, createTheme } from '@mui/material/styles';


// Import Poppins font weights
import '@fontsource/poppins/300.css'; // Light
import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/500.css'; // Medium
import '@fontsource/poppins/600.css'; // Semi-bold
import '@fontsource/poppins/700.css'; // Bold

// Import your components
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Cm from "./scenes/cm";
import Hob from "./scenes/hob";
import Crm from "./scenes/crm";
import Organization from "./scenes/organization";
import AllExperiences from "./scenes/experiences/allExperiences";
import NewExperiences from "./scenes/experiences/newExperiences";
import PendingExperiences from "./scenes/experiences/pendingExperiences";
import ResolvedExperiences from "./scenes/experiences/resolvedExperiences";
import Bar from "./scenes/bar";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar/calendar";
import Profile from "./scenes/profile";
import Notes from "./scenes/notes";
import CmDetails from "./scenes/cmdetails";
import CrmDetails from "./scenes/crmdetails";
import OrganizationDetails from "./scenes/organizationdetails";
import HobDetails from "./scenes/hobdetails";
import TicketDetails from "./scenes/ticketsdetails";
import Form from "./scenes/form";
import CmForm from "./scenes/cmform";
import CrmForm from "./scenes/crmform";
import BsuForm from "./scenes/bsuform";
import OrganizationForm from "./scenes/organizationform";
import Login from "./scenes/login";

const router = createBrowserRouter(
  [
    { path: "/", element: <Dashboard /> },
    { path: "/cm", element: <Cm /> },
    { path: "/crm", element: <Crm /> },
    { path: "/hob", element: <Hob /> },
    { path: "/organization", element: <Organization /> },
    { path: "/allExperiences", element: <AllExperiences /> },
    { path: "/newExperiences", element: <NewExperiences /> },
    { path: "/pendingExperiences", element: <PendingExperiences /> },
    { path: "/resolvedExperiences", element: <ResolvedExperiences /> },
    { path: "/profile", element: <Profile /> },
    { path: "/notes", element: <Notes /> },
    { path: "/form", element: <Form /> },
    { path: "/cmform", element: <CmForm /> },
    { path: "/crmform", element: <CrmForm /> },
    { path: "/bsuform", element: <BsuForm /> },
    { path: "/organizationform", element: <OrganizationForm /> },
    { path: "/cmdetails", element: <CmDetails /> },
    { path: "/crmdetails", element: <CrmDetails /> },
    { path: "/organizationdetails", element: <OrganizationDetails /> },
    { path: "/hobdetails", element: <HobDetails /> },
    { path: "/ticketdetails", element: <TicketDetails /> },
    { path: "/bar", element: <Bar /> },
    { path: "/pie", element: <Pie /> },
    { path: "/line", element: <Line /> },
    { path: "/faq", element: <FAQ /> },
    { path: "/calendar", element: <Calendar /> },
    { path: "/geography", element: <Geography /> },
    { path: "*", element: <Navigate to="/" /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true, // Opt into the new behavior for relative splat routes
    },
  }
);

function Cgcvhg() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Create theme with Poppins font
  const appTheme = createTheme(theme, {
    typography: {
      fontFamily: [
        'Poppins',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 500 },
      h6: { fontWeight: 500 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsAuthenticated(!!token);  // Convert token existence to boolean
  }, []);
  
  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/');
  };
const handleLogout = () => { 
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  }


  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />

        {/* Topbar: Full width at the top */}
        <Box sx={{ width: "100vw", top: 5, zIndex: 1000, display: isAuthenticated ? "block" : "none" }}>
          <Topbar setIsSidebar={setIsSidebar} onLogout = {handleLogout} />
        </Box>

        {/* Sidebar: Fixed on the left */}
        {isAuthenticated && !isMobile && isSidebar && (
          <Box
            sx={{
              position: "fixed",
              left: 0,
              top: "64px",
              height: "calc(100vh - 64px)",
              width: "260px",
              zIndex: 900,
              // display: isAuthenticated  === 'true' ? "block" : "none"
            }}
          >
            <Sidebar isSidebar={isSidebar} onLogout = {handleLogout} />
          </Box>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginLeft: isMobile || !isAuthenticated ? "0px" : isSidebar ? "260px" : "0px" ,
            padding: "20px 20px 20px",
            overflowY: "auto",
            transition: "margin 0.3s ease-in-out",
            "&::-webkit-scrollbar": {
              width: "1px",
              height: "5px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#000000",
              borderRadius: "4px",
            },
            fontFamily: 'Poppins, sans-serif !important',
          }}
        >
          {isAuthenticated ? (
            <RouterProvider router={router} />
          ) : (
            <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default Cgcvhg;