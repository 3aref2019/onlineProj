//React
import React, { useEffect, useState } from "react";

//Antd
import { Modal, Button, Input } from "antd";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Types
import { State } from "../../redux/types";

//Actions
import {
  addSubAction,
  closeSubModel,
  openSubModel,
} from "../../redux/slices/subSlice";

//Actions
import { getCourses } from "../../redux/slices/coursesSlice";

//Component
const AdminSubCourseAdd = () => {
  const dispatch = useDispatch();

  const { posting, postingError, subModel } = useSelector(
    (state: State) => state.sub
  );

  const { list } = useSelector((state: State) => state.courses);

  const [title, setTitle] = useState("");
  const [description, setBody] = useState("");
  const [courseSlug, setCourseSlug] = useState("");

  const handleOk = () => {
    dispatch(addSubAction({ title, description, courseSlug }));
  };

  const handleCancel = () => {
    dispatch(closeSubModel());
  };

  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  return (
    <>
      <Button type="primary" onClick={() => dispatch(openSubModel())}>
        Add section
      </Button>
      <Modal
        title="Add section"
        wrapClassName="text-center"
        visible={subModel}
        onOk={handleOk}
        confirmLoading={posting}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label className="font-bold">Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={posting}
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <p className="text-red-500">{postingError && postingError.title}</p>
          <label className="font-bold">Description</label>
          <Input
            placeholder="Description"
            name="description"
            disabled={posting}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={description}
            onChange={(e: any) => setBody(e.target.value)}
          />
          <p className="text-red-500">
            {postingError && postingError.description}
          </p>
          <label className="font-bold">Course</label>
          <select
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            name=""
            id=""
            onChange={(e: any) => {
              setCourseSlug(e.target.value);
            }}
          >
            <>
              <option value="">choose</option>
            </>
            {list.map((course) => {
              return (
                <>
                  <option key={course.id} value={course.slug}>
                    {course.name}
                  </option>
                </>
              );
            })}
          </select>
          <p className="text-red-500">
            {postingError && postingError.courseSlug}
          </p>
        </form>
      </Modal>
    </>
  );
};

export default AdminSubCourseAdd;
