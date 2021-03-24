// React & Redux
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//antd
import "antd/dist/antd.css";
import { Alert, Table, Modal, Button } from "antd";

//Types
import { State } from "../../redux/types";

//Actions
import { deleteCourse } from "../../redux/slices/courseSlice";
// Components
import AdminCourseAdd from "./AdminCourseAdd";
import AdminCourseEdit from "./AdminCourseEdit";

// Dayjs
import { formatDate } from "../../utils/dayjsHelper";
import dayjs from "dayjs";
import { ColumnsType } from "antd/lib/table";
import { getCourses } from "../../redux/slices/coursesSlice";
import { Link } from "react-router-dom";

const AdminCourse = () => {
  // Get all courses  when page load
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  //get courses &  course states
  const { list, status } = useSelector((state: State) => state.courses);
  const { deleting, updating, posting } = useSelector(
    (state: State) => state.course
  );

  //TODO move it to redux
  const [deleteModel, setDeleteModel] = useState({
    open: false,
    id: undefined,
  });

  // ANTD columns to fill the table
  const columns: ColumnsType<any> = [
    {
      title: "Display order",
      dataIndex: "apperance_order",
      sorter: (a, b) => a.apperance_order - b.apperance_order,
      render: (_, record) => (
        <p className="font-bold">{record.apperance_order}</p>
      ),
      filterIcon: true,
    },
    {
      title: "title",
      dataIndex: "name",
    },
    {
      title: "description",
      dataIndex: "description",
    },
    {
      title: "creation date",
      dataIndex: "createdAt",
      sorter: (a, b) => dayjs(a.createdAt).diff(dayjs(b.createdAt)),
      render: (_, record) => (
        <p className="p-1 ml-2 rounded">{formatDate(record.createdAt)}</p>
      ),
    },
    {
      title: "actions",
      key: "action",
      render: (_, { name, description, slug, apperance_order }) => (
        <>
          <AdminCourseEdit
            apperanceOrder={Number(apperance_order)}
            name={name}
            description={description}
            slug={slug}
          />
          <Button
            size="small"
            type="primary"
            danger
            onClick={() => {
              setDeleteModel({ id: slug, open: true });
            }}
          >
            Delete
          </Button>
          <button className="p-1 ml-2 text-white bg-green-400 rounded hover:text-red-200">
            <Link to={`/c/courses/${slug}`}>preview</Link>
          </button>
          <div>
            <Modal
              title={`delete course: ${name}`}
              destroyOnClose
              style={{ textAlign: "center", justifyContent: "center" }}
              visible={deleteModel.open && deleteModel.id === slug}
              onOk={() => dispatch(deleteCourse({ slug }))}
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
                className="border-red-500"
              />
            </Modal>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="m-10 mt-3 ">
      <div className="flex justify-between mt-4 ml-4 justify-items-end">
        <button className="p-1 ml-2 text-white bg-green-400 rounded ">
          <Link to={`/c/courses`}>VIEW ON SITE</Link>
        </button>
        <AdminCourseAdd />
      </div>
      <Table
        size="middle"
        bordered={true}
        showSorterTooltip
        columns={columns}
        dataSource={list}
        loading={status || deleting || updating || posting}
      />
    </div>
  );
};

export default AdminCourse;
