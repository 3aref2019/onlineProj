// React & Redux
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//antd
import "antd/dist/antd.css";
import { Alert, Table } from "antd";
import Modal from "antd/lib/modal/Modal";

//Types
import { State } from "../../redux/types";

//Actions
import { getSubsAction } from "../../redux/slices/subsSlice";
import { deleteSubAction } from "../../redux/slices/subSlice";

// Compontnes
import { formatDate } from "../../utils/dayjsHelper";
import AdminSubCourseAdd from "./AdminSubCourseAdd";
import AdminSubCourseEdit from "./AdminSubCourseEdit";

const AdminSubCourse = () => {
  // Get all courses when page laod
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSubsAction());
  }, [dispatch]);
  const [deleteModel, setDeleteModel] = useState({
    open: false,
    id: undefined,
  });
  //get courses & single course states
  const { list, status, filters } = useSelector((state: State) => state.subs);
  const { deleting, posting, updating } = useSelector(
    (state: State) => state.sub
  );

  // ANTD columns to fill the table
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Course",
      dataIndex: "courseName",
      filters,
      onFilter: (value, record) => record.courseName === value,
      render: (_, record) => (
        <>
          <p className="p-1 ml-2 rounded">{record.courseName}</p>
        </>
      ),
    },
    {
      title: "Latest update",
      dataIndex: "updatedAt",
      render: (_, record) => (
        <>
          <p className="p-1 ml-2 rounded">{formatDate(record.updatedAt)}</p>
        </>
      ),
    },
    {
      title: "Creation date",
      dataIndex: "createdAt",
      render: (_, record) => (
        <p className="p-1 ml-2 rounded">{formatDate(record.createdAt)}</p>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, { title, description, slug }) => (
        <>
          <AdminSubCourseEdit
            title={title}
            description={description}
            slug={slug}
          />
          <button
            className="p-1 ml-2 text-white bg-red-500 rounded hover:text-red-200"
            onClick={() => {
              setDeleteModel({ id: slug, open: true });
            }}
          >
            delete
          </button>
          <div>
            <Modal
              title={`Delete section: ${title}`}
              destroyOnClose
              style={{ textAlign: "center", justifyContent: "center" }}
              visible={deleteModel.open && deleteModel.id === slug}
              onOk={() => dispatch(deleteSubAction({ slug }))}
              confirmLoading={deleting}
              okText="delete"
              cancelText="cancel"
              onCancel={() => setDeleteModel({ id: undefined, open: false })}
              okType="danger"
            >
              <Alert
                message="You cannot undo this action"
                type="warning"
                showIcon
                className="border-secondary"
              />
            </Modal>
          </div>
        </>
      ),
    },
  ];
  return (
    <div className="m-10 mt-3 ">
      <div className="flex justify-end mt-4 ml-4 justify-items-end">
        <AdminSubCourseAdd />
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

export default AdminSubCourse;
