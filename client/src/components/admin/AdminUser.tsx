//React
import React, { useEffect, useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Alert, Button, Dropdown, Tag, Table } from "antd";
import Modal from "antd/lib/modal/Modal";
import { DownOutlined, SearchOutlined } from "@ant-design/icons";
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
import SearchColumns from "./shared/SearchColumns";
import AdminUserEdit from "./AdminUserEdit";
import AdminUserAdd from "./AdminUserAdd";
import FilterColumns from "./shared/FilterColumns";

const roleFilters = [
  {
    text: "admin",
    value: "admin",
  },
  { text: "editor", value: "editor" },
  { text: "user", value: "user" },
];
const AdminUser = () => {
  const dispatch = useDispatch();
  //AR
  //
  const { list, status } = useSelector((state: State) => state.users);
  const { deleting, updating, posting } = useSelector(
    (state: State) => state.user
  );
  useEffect(() => {
    dispatch(getUsersAction());
  }, [dispatch]);
  //Todo move it to Redux
  const [deleteModel, setDeleteModel] = useState({
    open: false,
    id: undefined,
  });

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
      onFilter: (value, record) =>
        record.username
          ? record.username
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase())
          : "",
      filterDropdown: SearchColumns,
    },
    {
      title: "Email",
      dataIndex: "email",
      onFilter: (value, record) =>
        record.email
          ? record.email.toString().toLowerCase().includes(value.toLowerCase())
          : "",
      filterDropdown: SearchColumns,
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      filterDropdown: ({ setSelectedKeys, confirm, clearFilters }) => (
        <FilterColumns
          setSelectedKeys={setSelectedKeys}
          confirm={confirm}
          clearFilters={clearFilters}
          filters={roleFilters}
        />
      ),
      onFilter: (value, record) => record.role === value,
      render: (_, { role }) => (
        <>
          <p className="p-1 ml-2 rounded">
            {role === "admin" && <Tag color="red">{role}</Tag>}
            {role === "editor" && <Tag color="blue">{role}</Tag>}
            {role === "user" && <Tag color="green">{role}</Tag>}
          </p>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, record: { status: any }) => (
        <>
          <p className="p-1 ml-2 rounded">
            {record.status ? (
              <Tag color="green">active</Tag>
            ) : (
              <Tag color="red">suspended</Tag>
            )}
          </p>
        </>
      ),
    },

    {
      title: "Email Confirmation",
      dataIndex: "emailConfirmed",
      render: (_, record) => (
        <p className="p-1 ml-2 rounded">
          <>
            <Tag color={record.emailConfirmed ? "green" : "red"}>
              {record.emailConfirmed ? " Confirmed" : "Not Confirmed"}
            </Tag>
            <Dropdown
              trigger={["click"]}
              overlay={
                <div>
                  <Button
                    type="primary"
                    danger={record.emailConfirmed}
                    onClick={() =>
                      dispatch(activateUserEmail({ id: record.id }))
                    }
                  >
                    {record.emailConfirmed ? "disactivate" : "activate"}
                  </Button>
                </div>
              }
            >
              <Button
                type="link"
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <DownOutlined />
              </Button>
            </Dropdown>
          </>
        </p>
      ),
    },
    {
      title: "Creation date",
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
                  delete
                </Button>
                <Modal
                  title={`Delete user: ${username}`}
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
            <Button
              type="link"
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <DownOutlined />
            </Button>
          </Dropdown>
        </>
      ),
    },
  ];
  return (
    <div className="m-10 mt-3">
      <div className="flex justify-end mt-4 ml-4 justify-items-end">
        <AdminUserAdd />
      </div>
      <Table
        bordered
        showSorterTooltip
        columns={columns}
        dataSource={list}
        loading={status || deleting || updating || posting}
      />
    </div>
  );
};

export default AdminUser;
