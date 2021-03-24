//React
import React, { useState } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Modal, Button, Input } from "antd";

//React
import { State } from "../../redux/types";

//Actions
import {
  createBook,
  closeBookModel,
  openBookModel

} from "../../redux/slices/bookSlice";

//Draft Js
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

//Component
const AdminBookAdd = () => {
  const dispatch = useDispatch();
  const { posting, postingError, bookModel } = useSelector(
    (state: State) => state.book
  );
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState<EditorState>(EditorState.createEmpty());
  const [picture, setPicture] = useState<File | null>(null);

  const handleOk = () => {
    dispatch(
      createBook({
        title,
        description: JSON.stringify(convertToRaw(description.getCurrentContent())),
        picture,
        link
      })
    );
  };
  const handleCancel = () => {
    dispatch(closeBookModel());
  };


  return (
    <>
      <Button type="primary" onClick={() => dispatch(openBookModel())}>
        Add an book
      </Button>
      <Modal
        title="Add a book"
        visible={bookModel}
        onOk={handleOk}
        confirmLoading={posting}
        onCancel={handleCancel}
        width={"800px"}
      >
        <form className="flex flex-col ">
          <label>Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={posting}
            placeholder="Title"
            name="title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <p className="text-red-500 ">
            {postingError && postingError.title}
          </p>
          <label>Link</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={posting}
            placeholder="Link"
            name="link"
            value={link}
            onChange={(e: any) => setLink(e.target.value)}
          />
          <label>Content</label>
          <div >
            <Editor
              editorState={description}
              toolbarClassName="border border-blue-200 py-2"
              wrapperClassName="border  py-2"
              editorClassName="border border-blue-200 space-y-3 py-2"
              onEditorStateChange={(editorState: EditorState) => {
                setDescription(editorState);
              }}
            />
          </div>
          <p className="text-red-500">{postingError && postingError.description}</p>
          <label>Header</label>
          <Input type="file" onChange={(e) => {if (e.target.files) setPicture(e.target.files[0]);}} />
        </form>
      </Modal>
    </>
  );
};


export default AdminBookAdd;
