import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  // TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, message, Card } from "antd";
import Logo from "./logo.png";


// const { Title } = Typography;

const Login = ({ onLogin }) => {
    const [form] = Form.useForm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/hobLogin`,
            // `http://127.0.0.1:8080/v1/hobLogin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();

      if (response.ok) {
        onLogin();
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("hobDetails", JSON.stringify(data.data));
        navigate("/hob");
      } else {
        message.error(data.error || "Invalid credentials");
      }
    } catch (error) {
      message.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        height: "76vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Grid
        container
        sx={{
          height: isMobile ? "auto" : "80vh",
          borderRadius: 2,
          overflow: "hidden",
          // boxShadow: 3,
          marginTop: isMobile ? "30px" : 0,
          justifyContent: "center", // Ensure the grid is centered
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            p: isMobile ? 3 : 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "background.paper",
            boxShadow: 3, // Ensure shadow is applied only to this section
            borderRadius: 2, // Apply border-radius only to this section
          }}
        >
          <Box
            sx={{
              maxWidth: 400,
              mx: "auto",
              width: "100%",
            }}
          >
            <Box textAlign="center" mb={5}>
              <img
                src={Logo}
                alt="logo"
                style={{ minWidth: 100, width: "80%" }}
              />
            </Box>

            <Typography variant="body1" mb={1}>
              Please login to your account
            </Typography>

            {error && (
              <Typography color="error" mb={2}>
                {error}
              </Typography>
            )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
      <Form.Item
              label="Email address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your email"
                style={{
                  borderRadius: 8,
                  fontSize: 16,
                  padding: "10px 14px",
                }}
              />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
            >
              <Input.Password
                size="large"
                placeholder="Enter your password"
                style={{
                  borderRadius: 8,
                  fontSize: 16,
                  padding: "10px 14px",
                }}
              />
            </Form.Item>

              <Box textAlign="center" pt={1} mb={2} pb={1}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    mb: 3,
                    fontWeight: "bold",
                    background:
                      "linear-gradient(to right, #0A0A3D, #1C1C6B, #2E2E9F, #5050D4, #5050D4)",
                    color: "white",
                    "&:hover": {
                      background:
                        "linear-gradient(to right, #0A0A3D, #1C1C6B, #2E2E9F, #5050D4, #5050D4)",
                    },
                  }}
                >
                  Sign in
                </Button>
              </Box>
               </Form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
