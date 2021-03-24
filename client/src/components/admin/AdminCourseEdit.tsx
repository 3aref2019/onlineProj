//React
import React, { useEffect, useState } from "react";

//Antd
import { Button, Modal } from "antd";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Types
import { State } from "../../redux/types";

//Actions
import {
  closeEditCourseModel,
  updateCourse,
  openEditCourseModel,
} from "../../redux/slices/courseSlice";

interface Props {
  name: string;
  description: string;
  slug: string;
  apperanceOrder: number;
}
const AdminCourseEdit = (props: Props) => {
  const dispatch = useDispatch();
  const {
    updating,
    updatingError,
    editCourseModel,
    editCourseModelId,
  } = useSelector((state: State) => state.course);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [apperanceOrder, setApperanceOrder] = useState(0);

  const handleOk = () => {
    dispatch(
      updateCourse({
        name,
        description,
        slug: props.slug,
        apperance_order: apperanceOrder,
      })
    );
  };
  useEffect(() => {
    setName(props.name);
    setDescription(props.description);
    setApperanceOrder(props.apperanceOrder);
  }, [props]);
  const handleCancel = () => {
    dispatch(closeEditCourseModel());
  };

  return (
    <>
      <Button
        size="small"
        type="primary"
        onClick={() => dispatch(openEditCourseModel({ id: props.slug }))}
        className="m-2"
      >
        edit
      </Button>
      <Modal
        destroyOnClose={true}
        title={`Edit course : ${name}`}
        wrapClassName="text-center"
        visible={editCourseModel && props.slug === editCourseModelId}
        onOk={handleOk}
        confirmLoading={updating}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label>Display order</label>
          <input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="number"
            disabled={updating}
            placeholder="Display order"
            max={5}
            min={1}
            name="apperance_order"
            value={apperanceOrder}
            onChange={(e: any) => setApperanceOrder(e.target.value)}
          />
          <p className="text-red-500">
            {updatingError && updatingError.apperance_order}
          </p>

          <label>Title</label>
          <input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={updating}
            placeholder="title"
            name="name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <p className="text-red-500">{updatingError && updatingError.name}</p>
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

export default AdminCourseEdit;
