//React
import { useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Button, Input, Modal } from "antd";

//Types
import { State } from "../../redux/types";

//Actions
import {
  openEditLessonModel,
  closeEditLessonModel,
  updateLesson,
} from "../../redux/slices/lessonSlice";
//DraftJs
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";

//Component
const AdminLessonEdit = (props: Props) => {
  //redux
  const dispatch = useDispatch();

  const {
    updating,
    updatingError,
    editLessonModel,
    editLessonModelId,
  } = useSelector((state: State) => state.lesson);
  //
  const [title, setTitle] = useState<string>(props.title);
  const [videoLink, setVideoLink] = useState<string>(props.videoLink);
  const [body, setBody] = useState<EditorState>(
    EditorState.createWithContent(convertFromRaw(JSON.parse(props.body)))
  );
  const handleOk = () => {
    dispatch(
      updateLesson({
        title,
        body: JSON.stringify(convertToRaw(body.getCurrentContent())),
        videoLink,
        identifier: props.identifier,
        slug: props.slug,
      })
    );
  };
  const handleCancel = () => {
    dispatch(closeEditLessonModel());
  };

  return (
    <>
      <Button
        size="small" type="primary"
        onClick={() => dispatch(openEditLessonModel({ id: props.identifier }))}
      >
        edit
      </Button>
      <Modal
        destroyOnClose={true}
        title="Edit lesson"
        visible={editLessonModel && props.identifier === editLessonModelId}
        onOk={handleOk}
        confirmLoading={updating}
        onCancel={handleCancel}
        width={"1000px"}
      >
        <form className="flex flex-col ">
          <label className="font-bold">Title</label>
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
          <label className="font-bold">Content</label>
          <div >
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

          <label className="font-bold">Link</label>
          <Input
            type="text"
            placeholder="Link"
            name="videoLink"
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={videoLink}
            onChange={(e: any) => setVideoLink(e.target.value)}
          />
          <p className="text-red-500">
            {updatingError && updatingError.videoLink}
          </p>
        </form>
      </Modal>
    </>
  );
};

interface Props {
  title: string;
  body: string;
  videoLink: string;
  identifier: string;
  slug: string;
}

export default AdminLessonEdit;
