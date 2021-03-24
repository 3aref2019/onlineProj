//React
import React, { useEffect, useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Alert, Table } from "antd";
import Modal from "antd/lib/modal/Modal";

//Types
import { State } from "../../redux/types";

//Actions
import { getCommentsActions } from "../../redux/slices/commentsSlice";
import { deleteCommentActionAdmin } from "../../redux/slices/commentSlice";
import { Link } from "react-router-dom";

const AdminComment = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCommentsActions());
  }, [dispatch]);
  const [deleteModel, setDeleteModel] = useState({
    open: false,
    id: undefined,
  });
  const { list, status } = useSelector((state: State) => state.comments);
  const { deleting } = useSelector((state: State) => state.comment);
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: (a, b) => a.username.length - b.username.length,
    },
    {
      title: "Content",
      dataIndex: "body",
    },
    {
      title: "Actions",
      key: "action2",
      render: (_, { lesson }) => (
        <Link to={`/p/${lesson.subSlug}/${lesson.identifier}/${lesson.slug}`}>
          <p>{lesson.title}</p>
        </Link>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, { id, lesson }) => (
        <>
          <button
            className="p-1 ml-2 text-white bg-red-500 rounded hover:text-red-200"
            onClick={() => {
              setDeleteModel({ id, open: true });
            }}
          >
            Delete
          </button>
          {false && lesson.title}
          <Modal
            title={`Delete Comment`}
            destroyOnClose
            style={{ textAlign: "center", justifyContent: "center" }}
            visible={deleteModel.open && deleteModel.id === id}
            onOk={() => {
              dispatch(deleteCommentActionAdmin({ id }));
              setDeleteModel({ open: false, id: undefined });
            }}
            confirmLoading={deleting}
            okText="delete"
            cancelText="cancel"
            onCancel={() => setDeleteModel({ id: undefined, open: false })}
            okType="danger"
          >
            <Alert
              message="you cannot undo this action"
              type="warning"
              showIcon
              className="border-secondary"
            />
          </Modal>
        </>
      ),
    },
  ];

  return (
    <div className="m-10 mt-3 ">
      <Table
        bordered
        showSorterTooltip
        columns={columns}
        dataSource={list}
        loading={status || deleting}
        style={{ textAlign: "center" }}
      />
    </div>
  );
};

export default AdminComment;
