//React
import React, { useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Modal, Button, Input } from "antd";

//Types
import { State } from "../../redux/types";

//Actions
import {
  closeCourseModel,
  openCourseModel,
  createCourse,
} from "../../redux/slices/courseSlice";
import TextArea from "antd/lib/input/TextArea";

//Component
const AdminCourseAdd = () => {
  const dispatch = useDispatch();
  //Course State
  const { posting, postingError, courseModel } = useSelector(
    (state: State) => state.course
  );
  //

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState<File | null>(null);

  //

  const handleOk = () => {
    dispatch(createCourse({ name, description, picture }));
    setName("");
    setDescription("");
  };

  const handleCancel = () => {
    dispatch(closeCourseModel());
  };
  return (
    <>
      <Button type="primary" onClick={() => dispatch(openCourseModel())}>
        Add Course
      </Button>
      <Modal
        title="Add Course"
        visible={courseModel}
        onOk={handleOk}
        confirmLoading={posting}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label>Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={posting}
            placeholder="Title"
            name="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <p className="text-red-500">{postingError && postingError.name}</p>
          <label>Description</label>
          <TextArea
            placeholder="Description"
            name="description"
            disabled={posting}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
          <p className="text-red-500">
            {postingError && postingError.description}
          </p>
          <label>Header</label>
          <Input
            type="file"
            onChange={(e) => {
              if (e.target.files) setPicture(e.target.files[0]);
            }}
          />
        </form>
      </Modal>
    </>
  );
};

export default AdminCourseAdd;
