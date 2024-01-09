import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Checkbox, Alert } from "antd";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    if (sessionStorage.getItem("loggedIn") === "true") {
      console.log("User is already logged in");
      navigate("/dashboard");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:9090/api/v1/login",
        values,
        {
          timeout: 15000, // 15 seconds for the overall request timeout
          httpAgent: {
            timeout: 30000, // 30 seconds for the read timeout
          },
        }
      );
      if (response.data.success) {
        console.log("Success:", response.data);
        sessionStorage.setItem("loggedIn", true);
        navigate("/dashboard");
      } else {
        console.error("Login failed:", response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        setError("The request took too long to complete. Please try again.");
      } else {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        setError("An error occurred during. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="illustration-wrapper">
          {/* Defer loading the image */}
          <img
            src="https://mixkit.imgix.net/art/preview/mixkit-left-handed-man-sitting-at-a-table-writing-in-a-notebook-27-original-large.png?q=80&auto=format%2Ccompress&h=700"
            alt="Login"
            loading="lazy"
            decoding="async"
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
          />
        </div>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}
          <p className="form-title">Welcome back</p>
          <p>Login to the NewCityTraders Admin</p>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Username" allowClear />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" allowClear />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
