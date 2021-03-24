import Modal from "antd/lib/modal/Modal";
import React, { useState } from "react";
import { handleBio } from "../../redux/slices/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/lib/input/TextArea";
import { State } from "../../redux/types";
import { Spin } from "antd";

// Prop Types
interface PropTypes {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  errors: any;
  updating: boolean;
  bio: string;
}

// Component
function ProfileEditBio({
  isModalVisible,
  handleOk,
  handleCancel,
  updating,
  bio,
}: PropTypes) {
  const dispatch = useDispatch();
  const [bioState, setBio] = useState<string>(bio);
  const { loading } = useSelector((state: State) => state.auth);
  return (
    <Modal
      destroyOnClose
      centered
      okType="primary"
      title="Update bio"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={"save"}
      cancelText={"cancel"}
      confirmLoading={updating}
      closable={false}
      getContainer="#root"
    >
      {loading ? (
       <Spin size="large" spinning />
      ) : (
        <div className="flex flex-col mb-4">
          <div className="relative">
            <TextArea
              value={bioState}
              maxLength={150}
              showCount
              rows={3}
              size={"large"}
              id="name"
              name="name"
              placeholder="About me"
              className="relative w-full py-2 pl-12 pr-2 text-sm placeholder-gray-400 border rounded sm:text-base focus:border-blue-400 focus:outline-none"
              onChange={(e) => {
                setBio(e.target.value);
                dispatch(handleBio(e.target.value));
              }}
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default ProfileEditBio;
