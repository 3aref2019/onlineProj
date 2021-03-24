import Modal from "antd/lib/modal/Modal";
import React from "react";
import {
  handleNewEmailChange,
  handleOldEmailChange,
} from "../../redux/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../redux/types";
import { Input, Popover } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
// Prop Types
interface PropTypes {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  errors: any;
  updating: boolean;
  
}

// Component
function ProfileEditEmail({
  isModalVisible,
  handleOk,
  handleCancel,
  errors,
  updating,
}: PropTypes) {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: State) => state.auth);

  return (
    <Modal
      destroyOnClose
      centered
      okType="primary"
      title="Edit bio"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={"save"}
      cancelText={"cancel"}
      confirmLoading={updating}
      closable={false}
      getContainer="#root"

    >
      <div className="flex flex-col mb-4">
        <div className="relative">
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Current Email"
            className="relative w-full py-2 pr-2 text-sm placeholder-gray-400 border rounded sm:text-base focus:border-blue-400 focus:outline-none"
            onChange={(e) => dispatch(handleOldEmailChange(e.target.value))}
            addonAfter={
              <Popover
                content={!loading && censorEmail(user.email)}
                title="Current Email"
                trigger="click"
              >
                <InfoCircleOutlined />
              </Popover>
            }
          />
        </div>
        {errors && errors.oldEmail && (
          <span className="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
            {errors.oldEmail}ا
          </span>
        )}
      </div>

      <div className="flex flex-col mb-4">
        <div className="relative">
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="New Email"
            onChange={(e) => dispatch(handleNewEmailChange(e.target.value))}
            className="relative w-full py-2 pr-2 text-sm placeholder-gray-400 border rounded sm:text-base focus:border-blue-400 focus:outline-none"
            addonAfter={
              <Popover
                content={"make sure this email belongs to you"}
                trigger="click"
              >
                <InfoCircleOutlined />
              </Popover>
            }
          />
        </div>
        {errors && errors.newEmail && (
          <span className="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
            {errors.newEmail}ا
          </span>
        )}
      </div>
    </Modal>
  );
}

const censorEmail = (str: string) => {
  var split = str.split("@");
  var letter1 = split[0].substring(0, 1);
  var letter2 = split[0].substring(split[0].length - 1, split[0].length);
  var newFirst = letter1;
  for (let i = 0; i < split[0].length - 2; i++) {
    newFirst += "*";
  }
  newFirst += letter2;

  var letter3 = split[1].substring(0, 1);
  var extension = letter3;
  for (let i = 0; i < split[1].split(".")[0].length - 1; i++) {
    extension += "*";
  }
  extension += "." + split[1].split(".")[1];
  var result = newFirst + "@" + extension;

  return result;
};

export default ProfileEditEmail;
