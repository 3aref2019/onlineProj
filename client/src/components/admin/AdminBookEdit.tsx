//React
import React, { useState } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Input, Modal } from "antd";
//Types
import { State } from "../../redux/types";
//Actions
import {
  updateBook,
  closeBookModel,
  openEditBookModel
} from "../../redux/slices/bookSlice";
//DraftJs
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

const AdminBookEdit = (props: Props) => {
  const dispatch = useDispatch();
  const {
    updating,
    updatingError,
    editBookModel,editBookModelId
  } = useSelector((state: State) => state.book);

  const [title, setTitle] = useState(props.title);
  const [link, setLink] = useState(props.link);
  const [description, setBody] = useState<EditorState>(
    EditorState.createWithContent(convertFromRaw(JSON.parse(props.description)))
  );

  const handleOk = () => {
    dispatch(
      updateBook({
        title,
        description: JSON.stringify(convertToRaw(description.getCurrentContent())),
        slug: props.slug,
        link
      })
    );
  };
  const handleCancel = () => {
    dispatch(closeBookModel());
  };

  return (
    <>
      <button
        className="p-1 ml-2 text-white bg-blue-500 rounded hover:text-red-200"
        onClick={() => dispatch(openEditBookModel({ slug: props.slug }))}
      >
        edit
      </button>
      <Modal
        destroyOnClose={true}
        title={`Edit book : ${title}`}
        wrapClassName="text-center"
        visible={editBookModel && props.slug === editBookModelId}
        onOk={handleOk}
        confirmLoading={updating}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label>Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={updating}
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <p className="text-red-500">{updatingError && updatingError.title}</p>
          <label>Link</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={updating}
            placeholder="Link"
            name="link"
            value={link}
            onChange={(e: any) => setLink(e.target.value)}
          />
          <label>Content</label>
          <div>
            <Editor
              editorState={description}
              toolbarClassName="border border-blue-200 py-2"
              wrapperClassName="border  py-2"
              editorClassName="border border-blue-200 h-32 space-y-3"
              onEditorStateChange={(editorState: EditorState) => {
                setBody(editorState);
              }}
            />
          </div>
          <p className="text-red-500">{updatingError && updatingError.description}</p>
        </form>
      </Modal>
    </>
  );
};

//Props Types
interface Props {
  title: string;
  description: string;
  slug: string;
  link:string
}

export default AdminBookEdit;
