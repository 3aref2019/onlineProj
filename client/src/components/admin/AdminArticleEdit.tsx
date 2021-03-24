//React
import React, { useState } from "react";
//Redux
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Modal } from "antd";
//Types
import { State } from "../../redux/types";
//Actions
import {
  updateArticle,
  closeArticleModel,
  openEditArticleModel
} from "../../redux/slices/articleSlice";
//DraftJs
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

const AdminArticleEdit = (props: Props) => {
  const dispatch = useDispatch();
  const {
    updating,
    updatingError,
    editArticleModel,editArticleModelId
  } = useSelector((state: State) => state.article);


  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState<EditorState>(
    EditorState.createWithContent(convertFromRaw(JSON.parse(props.body)))
  );

  const handleOk = () => {
    dispatch(
      updateArticle({
        title,
        body: JSON.stringify(convertToRaw(body.getCurrentContent())),
        id: props.id,
      })
    );
  };
  const handleCancel = () => {
    dispatch(closeArticleModel());
  };

  return (
    <>
      <button
        className="p-1 ml-2 text-white bg-blue-500 rounded hover:text-red-200"
        onClick={() => dispatch(openEditArticleModel({ id: props.id }))}
      >
        edit
      </button>
      <Modal
        destroyOnClose={true}
        title={`Edit article : ${title}`}
        wrapClassName="text-center"
        visible={editArticleModel && props.id === editArticleModelId}
        onOk={handleOk}
        confirmLoading={updating}
        onCancel={handleCancel}
        width={"700px"}
      >
        <form className="flex flex-col ">
          <label>Title</label>
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
          <label>Content</label>
          <div>
            <Editor
              editorState={body}
              toolbarClassName="border border-blue-200 py-2"
              wrapperClassName="border  py-2"
              editorClassName="border border-blue-200 h-32 space-y-3"
              onEditorStateChange={(editorState: EditorState) => {
                setBody(editorState);
              }}
            />
          </div>
          <p className="text-red-500">{updatingError && updatingError.body}</p>
        </form>
      </Modal>
    </>
  );
};

//Props Types
interface Props {
  title: string;
  body: string;
  id: string;
}

export default AdminArticleEdit;
