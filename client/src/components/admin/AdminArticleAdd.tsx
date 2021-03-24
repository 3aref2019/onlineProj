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
  createArticle,
  closeArticleModel,
  openArticleModel

} from "../../redux/slices/articleSlice";

//Draft Js
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

//Component
const AdminArticleAdd = () => {
  const dispatch = useDispatch();
  const { posting, postingError, articleModel } = useSelector(
    (state: State) => state.article
  );
  const [title, setTitle] = useState("");
  const [body, setBody] = useState<EditorState>(EditorState.createEmpty());
  const [picture, setPicture] = useState<File | null>(null);

  const handleOk = () => {
    dispatch(
      createArticle({
        title,
        body: JSON.stringify(convertToRaw(body.getCurrentContent())),
        picture,
      })
    );
  };
  const handleCancel = () => {
    dispatch(closeArticleModel());
  };


  return (
    <>
      <Button type="primary" onClick={() => dispatch(openArticleModel())}>
        Add an article
      </Button>
      <Modal
        title="Add an article"
        visible={articleModel}
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
          <label>Content</label>
          <div >
            <Editor
              editorState={body}
              toolbarClassName="border border-blue-200 py-2"
              wrapperClassName="border  py-2"
              editorClassName="border border-blue-200 space-y-3 py-2"
              onEditorStateChange={(editorState: EditorState) => {
                setBody(editorState);
              }}
            />
          </div>
          <p className="text-red-500">{postingError && postingError.body}</p>
          <label>Header</label>
          <Input type="file" onChange={(e) => {if (e.target.files) setPicture(e.target.files[0]);}} />
        </form>
      </Modal>
    </>
  );
};


export default AdminArticleAdd;
