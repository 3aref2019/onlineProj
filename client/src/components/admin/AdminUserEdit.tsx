//React
import React, { useState } from "react";

//Antd
import { Button, Modal } from "antd";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Types
import { State } from "../../redux/types";

//Actions
import {
  openEditUserModel,
  closeEditUserModel,
  editUserAction,
} from "../../redux/slices/userSlice";

const AdminUserEdit = (props: any) => {
  const dispatch = useDispatch();
  const {
    updating,
    updatingError,
    editUserModel,
    editUserModelId,
  } = useSelector((state: State) => state.user);
  const [username, setUsername] = useState(props.username);
  const [email, setEmail] = useState(props.email);
  const [role, setRole] = useState(props.role);

  const handleOk = () => {
    dispatch(
      editUserAction({
        username,
        email,
        role,
        id: props.id,
      })
    );
  };
  const handleCancel = () => {
    dispatch(closeEditUserModel());
  };

  return (
    <>
      <Button
        type="primary"
        size={"small"}
        className="m-1"
        onClick={() => dispatch(openEditUserModel({ id: props.id }))}
      >
        Edit
      </Button>
      <Modal
        destroyOnClose={true}
        title={`Edit user ${username}`}
        visible={editUserModel && props.id === editUserModelId}
        onOk={handleOk}
        confirmLoading={updating}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label className="font-bold">Username</label>
          <input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={updating}
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />
          <p className="text-red-500">
            {updatingError && updatingError.username}
          </p>
          <label className="font-bold">Email</label>
          <input
            placeholder="Email"
            name="email"
            type="email"
            disabled={updating}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <p className="text-red-500">{updatingError && updatingError.email}</p>

          <label className="font-bold">Role</label>
          <select
            name="role"
            onChange={(e: any) => setRole(e.target.value)}
            value={role}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
          >
            <option value="user">user</option>
            <option value="editor">editor</option>
            <option value="admin">admin</option>
          </select>
          <p className="text-red-500">{updatingError && updatingError.role}</p>
        </form>
      </Modal>
    </>
  );
};

export default AdminUserEdit;
