import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Form, Input, message } from "antd";
import Logo from "./logo.png";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [form] = Form.useForm();
    const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/hobForgotPassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("Password reset link sent to your email!");
        navigate("/hob/login"); // Redirect to login page
        form.resetFields();
      } else {
        message.error(data.error || "Failed to send reset link.");
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
          marginTop: isMobile ? "30px" : 0,
          justifyContent: "center",
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
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Box sx={{ maxWidth: 400, mx: "auto", width: "100%" }}>
            <Box textAlign="center" mb={5}>
              <img
                src={Logo}
                alt="logo"
                style={{ minWidth: 100, width: "80%" }}
              />
            </Box>
            <Typography variant="h6" mb={2} textAlign="center">
              Forgot Password
            </Typography>
            <Typography mb={3} textAlign="center" color="text.secondary">
              Enter your email address and we'll send you a link to reset your password.
            </Typography>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
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
              <Box textAlign="center" pt={1} mb={2} pb={1}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
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
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Box>
            </Form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;