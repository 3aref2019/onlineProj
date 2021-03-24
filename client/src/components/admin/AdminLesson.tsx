//React
import { useEffect } from "react";
import { Link } from "react-router-dom";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Button, Table, Tag } from "antd";

//Types
import { State } from "../../redux/types";

//Actions
import { getLessons } from "../../redux/slices/lessonsSlice";
import {
  deleteLesson,
  changeLessonDisplayStatus,
} from "../../redux/slices/lessonSlice";

//Components
import { formatDate } from "../../utils/dayjsHelper";
import AdminLessonEdit from "./AdminLessonEdit";
import AdminLessonAdd from "./AdminLessonAdd";

//Component
const AdminLesson = () => {
  const dispatch = useDispatch();

  // On Load , get All Lessons
  useEffect(() => {
    dispatch(getLessons());
  }, [dispatch]);

  const { list, status } = useSelector((state: State) => state.lessons);
  const { deleting, updating } = useSelector((state: State) => state.lesson);

  // Columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      sorter: true,
    },
    {
      title: "Section",
      dataIndex: "sub",
      sorter: true,
      render: (_, record) => (
        <>
          <p className="p-1 ml-2 rounded">{record.SubTitle}</p>
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "displayStatus",
      render: (_, record) => (
        <>
          <p className="p-1 ml-2 rounded">
            {record.displayStatus ? (
              <Tag color="green">shown</Tag>
            ) : (
              <Tag color="red">hidden</Tag>
            )}
          </p>
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
        <>
          <p className="p-1 ml-2 rounded">{formatDate(record.createdAt)}</p>
        </>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (
        _,
        { identifier, slug, title, videoLink, body, displayStatus, subSlug }
      ) => (
        <div className="space-x-1">
          <AdminLessonEdit
            title={title}
            key={identifier}
            body={body}
            videoLink={videoLink}
            identifier={identifier}
            slug={slug}
          />
          <Button
            size="small"
            type="primary"
            danger
            onClick={() => {
              dispatch(deleteLesson({ identifier, slug }));
            }}
          >
            delete
          </Button>
          <Link to={`/p/${subSlug}/${identifier}/${slug}`}>
            <Button size="small" type="primary" className="bg-yellow-300 ">
              preview
            </Button>
          </Link>
          <Button
            size="small"
            type="primary"
            onClick={() => {
              dispatch(changeLessonDisplayStatus({ identifier, slug }));
            }}
          >
            {displayStatus ? "hide" : "show"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="m-10 mt-3 ">
      <div className="flex justify-end mt-4 ml-4 justify-items-end">
        <AdminLessonAdd />
      </div>
      <Table
        bordered
        showSorterTooltip
        columns={columns}
        dataSource={list}
        loading={status || deleting || updating}
        style={{ textAlign: "center" }}
      />
    </div>
  );
};

export default AdminLesson;
