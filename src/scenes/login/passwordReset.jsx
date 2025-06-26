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
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Form, Input, message } from "antd";
import Logo from "./logo.png";

const PasswordReset = () => {
  const { hobid } = useParams();
  const [form] = Form.useForm();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Extract token from query params (e.g., /reset-password?token=abc)
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/hobPasswordReset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hobid: hobid,
            password: values.password,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        message.success("Password reset successful! Please log in.");
        navigate("/hob/login"); // Redirect to login
      } else {
        message.error(data.error || "Failed to reset password.");
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
              Reset Your Password
            </Typography>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your new password" },
                  { min: 6, message: "Password must be at least 6 characters" },
                ]}
                hasFeedback
              >
                <Input.Password
                  size="large"
                  placeholder="Enter new password"
                  style={{
                    borderRadius: 8,
                    fontSize: 16,
                    padding: "10px 14px",
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="Confirm new password"
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
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </Box>
            </Form>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PasswordReset;