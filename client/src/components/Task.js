import React, { useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { ErrorMessage, SuccessMessage } from "./Messages/Messages";
import axios from "axios";
import { DatePicker, Select, Input, Modal, Button } from "antd";
import { Loading } from "./Loading/Loading";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

export const Task = ({ task, index, update }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
    setTaskName(task.taskName);
    setPriority(task.priority);
    setTime(task.time);
    setComment(task.comment);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const deleteTask = async (id) => {
    await axios
      .delete(`/api/tasks/delete/${id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200 || res.status === 304) {
          SuccessMessage(res.data.successMessage);
          update();
        } else {
          ErrorMessage(res.data.errorMessage);
        }
      })
      .catch((err) => {
        ErrorMessage("err");
      });
  };

  const handleTimeChange = (date, dateString) => {
    setTime(dateString);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  /******************* add the task ***************/
  const updateTask = async (id) => {
    setLoading(true);
    await axios
      .put(
        `/api/tasks/update/${id}`,
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
          update();
        } else {
          ErrorMessage(res.data.errorMessage);
        }
      })
      .catch((err) => {
        setLoading(false);
        ErrorMessage("err");
      });
  };

  return (
    <tr>
      <th scope="row">{index + 1}</th>
      <td>
        <span
          style={
            task.priority === "high"
              ? { color: "red" }
              : task.priority === "normal" && { color: "green" }
          }
        >
          {task.taskName}
        </span>
      </td>
      <td>{task.time}</td>
      <td>
        <div className="buttons">
          <EditOutlined onClick={showModal} />
          <DeleteOutlined onClick={() => deleteTask(task._id)} />
        </div>
      </td>
      <td>{task.comment}</td>

      <Modal
        title="Add Task"
        footer={false}
        destroyOnClose
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <div className="add-todo-form">
          {loading ? (
            <Loading />
          ) : (
            <>
              <div>
                <Input
                  required
                  value={taskName}
                  placeholder="Enter task name"
                  onChange={(e) => setTaskName(e.target.value)}
                />
              </div>
              <div>
                <DatePicker
                  className="form-control bg-light form-control-todo"
                  value={moment(time)}
                  showTime
                  aria-required
                  disabledDate={(current) => {
                    return moment().add(-1, "days") >= current;
                  }}
                  onChange={handleTimeChange}
                />
              </div>
              <div>
                <Select
                  value={priority}
                  aria-required
                  defaultValue="Please choose..."
                  onChange={handlePriorityChange}
                >
                  <Option value="normal">Normal</Option>
                  <Option value="high">High</Option>
                </Select>
              </div>
              <div>
                <TextArea
                  value={comment}
                  placeholder="Enter Comment(Optional)"
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  onClick={() => updateTask(task._id)}
                >
                  Update
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </tr>
  );
};
