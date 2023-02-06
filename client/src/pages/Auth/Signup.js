import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { Loading } from "../../components/Loading/Loading";
import "./Auth.css";
import { Input, Form } from "antd";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../components/Messages/Messages";
import { ContactsOutlined, KeyOutlined, MailOutlined } from "@ant-design/icons";

export const Signup = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { fullName, email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const onFinish = async (e) => {
    window.scrollTo(0, 0);
    setLoading(true);
    await axios
      .post("/api/users/signup", { fullName, email, password })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          SuccessMessage(res.data.successMessage);
          setTimeout(() => {
            props.history.push("/login");
            document.location.reload();
          }, 2000);
        } else if (res.status === 201) {
          ErrorMessage(res.data.errorMessage);
        } else {
          ErrorMessage(res.data.errorMessage);
        }
      })
      .catch((err) => {
        setLoading(false);
        ErrorMessage(err);
      });
  };

  return (
    <div className="wrapper">
      <div className="container-fluid">
        <div className="card bg-transparent">
          <div className="card-body p-1">
            <div className="row">
              <div className="col-lg-3 d-none d-lg-block"></div>
              <div className="col-lg-7">
                <div className="p-5">
                  <div className="auth signup">
                    <div className="auth-inner">
                      <div className="text-center">
                        <div className="header">
                          <Link to="/">Task Manager</Link>
                        </div>
                        {loading ? (
                          <Loading />
                        ) : (
                          <Form
                            name="basic"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            className="user p-4"
                          >
                            <div className="mb-3 floating-label-group">
                              <Form.Item
                                name="Full Name"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your Full Name!",
                                  },
                                ]}
                              >
                                <Input
                                  className="form-control bg-light form-control-user"
                                  name="fullName"
                                  onChange={handleChange}
                                  size="small"
                                  placeholder="Full Name"
                                  prefix={<ContactsOutlined />}
                                />
                              </Form.Item>
                            </div>
                            <div className="mb-3 floating-label-group">
                              <Form.Item
                                name="email"
                                rules={[
                                  {
                                    type: "email",
                                    message: "The input is not valid E-mail!",
                                  },
                                  {
                                    required: true,
                                    message: "Please input your E-mail!",
                                  },
                                ]}
                              >
                                <Input
                                  className="form-control bg-light form-control-user"
                                  name="email"
                                  onChange={handleChange}
                                  size="small"
                                  placeholder="Email"
                                  prefix={<MailOutlined />}
                                />
                              </Form.Item>
                            </div>
                            <div className="mb-3 floating-label-group">
                              <Form.Item
                                className="form-control bg-light form-control-user"
                                name="password"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please input your password!",
                                  },
                                ]}
                                hasFeedback
                              >
                                <Input.Password
                                  className="form-control bg-light form-control-user"
                                  type="password"
                                  name="password"
                                  onChange={handleChange}
                                  size="small"
                                  placeholder="Password"
                                  prefix={<KeyOutlined />}
                                />
                              </Form.Item>
                            </div>
                            <div className="mb-3 floating-label-group">
                              <Form.Item
                                className="form-control bg-light form-control-user"
                                name="confirm"
                                dependencies={["password"]}
                                hasFeedback
                                rules={[
                                  {
                                    required: true,
                                    message: "Please confirm your password!",
                                  },
                                  ({ getFieldValue }) => ({
                                    validator(_, value) {
                                      if (
                                        !value ||
                                        getFieldValue("password") === value
                                      ) {
                                        return Promise.resolve();
                                      }
                                      return Promise.reject(
                                        new Error("Passwords don't match!")
                                      );
                                    },
                                  }),
                                ]}
                              >
                                <Input.Password
                                  className="form-control bg-light form-control-user"
                                  name="confimPassword"
                                  onChange={handleChange}
                                  size="small"
                                  placeholder="Re-Enter Password"
                                  prefix={<KeyOutlined />}
                                />
                              </Form.Item>
                            </div>
                            <div className="submit-btn-container">
                              <button
                                type="submit"
                                className="btn my-2 mt-3 w-100 btn-user btn-block"
                              >
                                Create Account
                              </button>
                            </div>
                          </Form>
                        )}
                        <div>
                          <p>
                            Already have an account?&nbsp;
                            <Link to="/login" className="pass">
                              Login
                            </Link>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
