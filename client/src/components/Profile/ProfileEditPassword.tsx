import Modal from "antd/lib/modal/Modal";
import React from "react";
import {
  handleNewPasswordChange,
  handleOldPasswordChange,
} from "../../redux/slices/profileSlice";
import { useDispatch } from "react-redux";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input } from "antd";

// Prop Types
interface PropTypes {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  errors: any;
  updating: boolean;
}

// Component
function ProfileEditPassword({
  isModalVisible,
  handleOk,
  handleCancel,
  errors,
  updating,
}: PropTypes) {
  const dispatch = useDispatch();
  return (
    <Modal
      destroyOnClose
      centered
      okType="primary"
      title="Update password"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={"save"}
      confirmLoading={updating}
      cancelText={"cancel"}
      closable={false}
      getContainer="#root"
    >
      <div className="flex flex-col mb-4">
        <Input.Password
          id="name"
          name="name"
          placeholder="Current password"
          onChange={(e) => dispatch(handleOldPasswordChange(e.target.value))}
        />
        {errors && errors.oldPassword && (
          <span className="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
            {errors.oldPassword}ا
          </span>
        )}
      </div>

      <div className="flex flex-col mb-4">
        <Input.Password
          id="name"
          name="name"
          placeholder="New password"
          onChange={(e) => dispatch(handleNewPasswordChange(e.target.value))}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
        />
        {errors && errors.newPassword && (
          <span className="flex items-center mt-1 ml-1 text-xs font-medium tracking-wide text-red-500">
            {errors.newPassword}
          </span>
        )}
      </div>
    </Modal>
  );
}

export default ProfileEditPassword;
