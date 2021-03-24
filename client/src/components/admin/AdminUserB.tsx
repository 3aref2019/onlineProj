//React
import React, { useEffect, useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Alert, Button, Dropdown, Table, Tag } from "antd";
import Modal from "antd/lib/modal/Modal";
import { DownOutlined } from "@ant-design/icons";

//Types
import { State } from "../../redux/types";

//Actions
import { getUsersAction } from "../../redux/slices/usersSlice";
import {
  activateUserEmail,
  deleteUserAction,
  suspendUser,
} from "../../redux/slices/userSlice";

//Components
import { formatDate } from "../../utils/dayjsHelper";
import dayjs from "dayjs";
import AdminUserEdit from "./AdminUserEdit";
import AdminUserAdd from "./AdminUserAdd";

const AdminUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsersAction());
  }, [dispatch]);

  //Todo move it to Redux
  const [deleteModel, setDeleteModel] = useState({
    open: false,
    id: undefined,
  });

  const { list, status } = useSelector((state: State) => state.users);
  const { deleting, updating, posting } = useSelector(
    (state: State) => state.user
  );

  //Table Columns
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Account",
      dataIndex: "status",
      render: (_: any, record: { status: any }) => (
        <>
          <p className="p-1 ml-2 rounded">
            {record.status ? (
              <Tag color="green">فعال</Tag>
            ) : (
              <Tag color="red">موقوف</Tag>
            )}
          </p>
        </>
      ),
    },
    {
      title: "الصلاحيات",
      dataIndex: "role",
      render: (_, { role }) => (
        <>
          <p className="p-1 ml-2 rounded">
            {role === "admin" && <Tag color="red">مدير</Tag>}
            {role === "editor" && <Tag color="blue">محرر</Tag>}
            {role === "user" && <Tag color="green">عضو</Tag>}
          </p>
        </>
      ),
      sorter: (a, b) => a.role.length - b.role.length,
    },
    {
      title: "Activate email",
      dataIndex: "emailConfirmed",
      render: (_, record) => (
        <p className="p-1 ml-2 rounded">
          <>
            <Tag color={record.emailConfirmed ? "green" : "red"}>
              {record.emailConfirmed ? "مفعل" : "غير مفعل"}
            </Tag>
            <Button
              size={"small"}
              danger={record.emailConfirmed}
              onClick={() => dispatch(activateUserEmail({ id: record.id }))}
            >
              {record.emailConfirmed ? "إلغاء التفعيل" : "تفعيل"}
            </Button>
          </>
        </p>
      ),
    },
    {
      title: "تاريخ التسجيل",
      dataIndex: "createdAt",
      render: (_, record) => (
        <p className="p-1 ml-2 rounded">{formatDate(record.createdAt)}</p>
      ),
      sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
    },
    // ACTIONS
    {
      title: "Actions",
      key: "action",
      render: (_, { id, username, email, role, status }) => (
        <>
          <Dropdown
            overlay={
              <div className="flex flex-col space-y-2 ">
                <AdminUserEdit
                  id={id}
                  username={username}
                  email={email}
                  role={role}
                  status={status}
                  key={id}
                />
                <Button
                  size={"small"}
                  danger
                  onClick={() => {
                    setDeleteModel({ id, open: true });
                  }}
                >
                  Delete
                </Button>
                <Modal
                  title={` Delete user: ${username}`}
                  destroyOnClose
                  style={{ textAlign: "center", justifyContent: "center" }}
                  visible={deleteModel.open && deleteModel.id === id}
                  onOk={() => dispatch(deleteUserAction({ id }))}
                  confirmLoading={deleting}
                  okText="delete"
                  cancelText="cancel"
                  onCancel={() =>
                    setDeleteModel({ id: undefined, open: false })
                  }
                  okType="danger"
                >
                  <Alert
                    message="You cannot undo this action"
                    type="warning"
                    showIcon
                    className="border-secondary"
                  />
                </Modal>

                <Button
                  size={"small"}
                  danger={status}
                  onClick={() => {
                    dispatch(suspendUser({ id }));
                  }}
                >
                  {status ? "suspend" : "expedite"}
                </Button>
              </div>
            }
            trigger={["click"]}
          >
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <DownOutlined />
            </a>
          </Dropdown>
        </>
      ),
    },
  ];

  return (
    <div className="m-10 mt-3 ">
      <div className="flex justify-end mt-4 ml-4 justify-items-end">
        <AdminUserAdd />
      </div>
      <Table
        bordered
        showSorterTooltip
        columns={columns}
        dataSource={list}
        loading={status || deleting || updating || posting}
        style={{ textAlign: "center" }}
      />
    </div>
  );
};

export default AdminUser;
