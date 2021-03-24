//React
import React, { useState } from "react";

//Antd
import { Modal, Button, Input } from "antd";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Types
import { State } from "../../redux/types";

//Actions
import {
  addUserAction,
  closeUserModel,
  openUserModel,
} from "../../redux/slices/userSlice";


//Component
const AdminUserAdd = () => {

  const dispatch = useDispatch();

  const { posting, postingError, userModel } = useSelector(
    (state: State) => state.user
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleOk = () => {
    dispatch(addUserAction({ username, email, password }));
  };

  const handleCancel = () => {
    dispatch(closeUserModel());
  };

  return (
    <>
      <Button type="primary" onClick={() => dispatch(openUserModel())}>
        Add new user
      </Button>
      <Modal
        title="Add new user"
        visible={userModel}
        onOk={handleOk}
        confirmLoading={posting}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label className="font-bold">Username</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={posting}
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e: any) => setUsername(e.target.value)}
          />
          <p className="text-red-500">
            {postingError && postingError.username}
          </p>
          <label className="font-bold">Username</label>
          <Input
            placeholder="Email"
            name="email"
            disabled={posting}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
          />
          <p className="text-red-500">{postingError && postingError.email}</p>

          <label className="font-bold">Password</label>
          <Input
            type="text"
            placeholder="Password"
            name="password"
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <p className="text-red-500">
            {postingError && postingError.password}
          </p>
        </form>
      </Modal>
    </>
  );
};

export default AdminUserAdd;
