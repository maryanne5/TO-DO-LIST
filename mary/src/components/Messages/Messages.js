import { message } from "antd";

export const SuccessMessage = (msg) => {
    message.success({
      content: msg,
      className: 'custom-class'
    });
  };
 export const ErrorMessage = (msg) => {
    message.error({
      content: msg,
      className: 'custom-class'
    });
  };
