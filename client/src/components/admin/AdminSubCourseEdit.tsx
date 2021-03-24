//React
import React, { useState } from "react";

//Antd
import { Modal } from "antd";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Types
import { State } from "../../redux/types";

//Actions
import {
  openEditSubModel,
  closeEditSubModel,
  editSubAction,
} from "../../redux/slices/subSlice";

const AdminSubCourseEdit = (props: Props) => {
  const dispatch = useDispatch();

  const { updating, updatingError, editSubModel, editSubModelId } = useSelector(
    (state: State) => state.sub
  );

  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);

  const handleOk = () => {
    dispatch(
      editSubAction({
        title,
        description,
        slug: props.slug,
      })
    );
  };

  const handleCancel = () => {
    dispatch(closeEditSubModel());
  };

  return (
    <>
      <button
        className="p-1 ml-2 text-white bg-blue-500 rounded hover:text-red-200"
        onClick={() => dispatch(openEditSubModel({ id: props.slug }))}
      >
        edit
      </button>
      <Modal
        destroyOnClose={true}
        title="Add section"
        wrapClassName="text-center"
        visible={editSubModel && props.slug === editSubModelId}
        onOk={handleOk}
        confirmLoading={updating}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label className="font-bold">Title</label>
          <input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={updating}
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <p className="text-red-500">{updatingError && updatingError.title}</p>
          <label>Description</label>
          <input
            placeholder="Description"
            name="description"
            disabled={updating}
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={description}
            onChange={(e: any) => setDescription(e.target.value)}
          />
          <p className="text-red-500">
            {updatingError && updatingError.description}
          </p>
        </form>
      </Modal>
    </>
  );
};

interface Props {
  title: string;
  slug: string;
  description: string;
}

export default AdminSubCourseEdit;
