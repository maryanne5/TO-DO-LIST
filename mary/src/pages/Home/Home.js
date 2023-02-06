import React, { useEffect, useState } from "react";
import { Input, Button, Modal, Select, DatePicker } from "antd";
import {
  ErrorMessage,
  SuccessMessage,
} from "../../components/Messages/Messages";
import axios from "axios";
import "./Home.css";
import { isAuthenticated, logout } from "../../components/auth/auth";
import { Task } from "../../components/Task";
import { Loading } from "../../components/Loading/Loading";
import moment from "moment";
import { LogoutOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

export const Home = (props) => {
  const [searchText, setSearchText] = useState("");
  const [allTasks, setAllTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("normal");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  /******************* add the task ***************/
  const addTask = async () => {
    setLoading(true);
    if (taskName && time) {
      await axios
        .post(
          "/api/tasks/add",
          { taskName, time, priority, comment },
          {
            headers: {
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((res) => {
          setLoading(false);
          if (res.status === 200 || res.status === 304) {
            SuccessMessage(res.data.successMessage);
            getAllTasks();
            setTaskName("");
            setTime("");
          } else {
            ErrorMessage(res.data.errorMessage);
          }
        })
        .catch((err) => {
          setLoading(false);
          ErrorMessage("error catched");
        });
    } else {
      setLoading(false);
      ErrorMessage("missing required fields");
    }
  };

  /*******************Getting all the tasks ***************/
  const getAllTasks = async () => {
    await axios
      .get("/api/tasks/get", {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 304) {
          setAllTasks(res.data);
        } else {
          ErrorMessage(res.data.errorMessage);
        }
      })
      .catch((err) => {
        ErrorMessage("err");
      });
  };

  useEffect(() => {
    if (isAuthenticated()) {
      getAllTasks();
    } else {
      props.history.push("/login");
    }

    return () => {};
  }, []);

  /******************* updating the task on screen automatically when we update them  ***************/
  const update = async () => {
    getAllTasks();
  };

  /*******************Input change values ***************/
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleTimeChange = (date, dateString) => {
    setTime(dateString);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  return (
    <>
      <div className="logout">
        <LogoutOutlined
          onClick={() => {
            logout(() => {
              props.history.push("/login");
              document.location.reload();
            });
          }}
        />
      </div>
      <div className="home">
        <div className="bg-secondary rounded">
          <h2>TODO List - # of tasks:{allTasks.length}</h2>
          <div className="form-header">
            <div className="search">
              <Input onChange={handleChange} placeholder="Search" />
            </div>
          </div>
          <br />
        </div>
        <div className="add-Task-button-container">
          <Button className="rounded-pill" type="primary" onClick={showModal}>
            Add Task
          </Button>
          <div className="wrapper">
            <div className="container-fluid">
              <div className="card bg-transparent">
                <div className="card-body p-1">
                  <Modal
                    title="Add Task"
                    footer={false}
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    destroyOnClose
                  >
                    <div className="add-todo-form">
                      {loading ? (
                        <Loading />
                      ) : (
                        <>
                          <div>
                            <Input
                              required
                              placeholder="* Enter task name"
                              onChange={(e) => {
                                setTaskName(e.target.value);
                              }}
                            />
                          </div>
                          <div>
                            <DatePicker
                              className="input-group input-group-sm input-group-calender input-group-prepend"
                              showTime
                              placeholder="* Select date and time"
                              disabledDate={(current) => {
                                return moment().add(-1, "days") >= current;
                              }}
                              aria-required
                              onChange={handleTimeChange}
                            />
                          </div>
                          <div>
                            <Select
                              aria-required
                              placeholder="* Priority(Normal by default)"
                              onChange={handlePriorityChange}
                            >
                              <Option value="normal">Normal</Option>
                              <Option value="high">High</Option>
                            </Select>
                          </div>
                          <div>
                            <TextArea
                              placeholder="Enter Comment(Optional)"
                              onChange={(e) => setComment(e.target.value)}
                            />
                            <div className="text-danger">
                              <p>fields with * are required</p>
                            </div>
                          </div>
                          <div>
                            <Button
                              style={{ width: "100%" }}
                              type="primary"
                              onClick={addTask}
                            >
                              Submit
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-container">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Task Name</th>
                  <th scope="col">Time</th>
                  <th scope="col">Action</th>
                  <th scope="col">Comment</th>
                </tr>
              </thead>
              <tbody>
                {allTasks &&
                  allTasks
                    .filter((f) =>
                      f.taskName
                        .toLowerCase()
                        .includes(searchText.toLowerCase())
                    )
                    .map((task, index) => {
                      return (
                        <Task
                          key={index}
                          task={task}
                          index={index}
                          update={update}
                        />
                      );
                    })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
