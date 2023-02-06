import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import { setAuthentication } from "../../components/auth/auth";
import { Loading } from "../../components/Loading/Loading";
import {
  SuccessMessage,
  ErrorMessage,
} from "../../components/Messages/Messages";
import { Input } from "antd";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";

export const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userData;

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const onFinish = async () => {
    window.scrollTo(0, 0);
    setLoading(true);
    await axios
      .post("/api/users/login", { email, password })
      .then((res) => {
        setLoading(false);
        if (res.status === 200) {
          setAuthentication(res.data, res.data.token);
          SuccessMessage(res.data.successMessage);
          props.history.push("/");
          window.location.reload();
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

  return loading ? (
    <Loading />
  ) : (
    <>
      <div className="wrapper">
        <div className="container-fluid">
          <div className="card bg-transparent">
            <div className="card-body p-1">
              <div className="row">
                <div className="col-lg-3 d-none d-lg-block"></div>
                <div className="col-lg-7">
                  <div className="p-5">
                    <div className="auth login">
                      <div className="auth-inner">
                        <div className="text-center">
                          <div className="header">
                            <Link to="/">Task Manager</Link>
                          </div>
                          <form onSubmit={onFinish} className="p-4">
                            <div className="floating-label-group">
                              <Input
                                name="email"
                                onChange={handleChange}
                                size="small"
                                placeholder="Email or Username"
                                prefix={<UserOutlined />}
                              />
                            </div>
                            <div className="floating-label-group">
                              <Input.Password
                                name="password"
                                type="password"
                                onChange={handleChange}
                                size="small"
                                placeholder="Password"
                                prefix={<KeyOutlined />}
                              />
                            </div>
                            <div className="submit-btn-container">
                              <button type="submit" className="btn w-100">
                                Login
                              </button>
                            </div>
                          </form>
                          <div className="mt-2">
                            <p>
                              Don't have an account? &nbsp;
                              <Link to="/signup" className="pass">
                                Register
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
    </>
  );
};
