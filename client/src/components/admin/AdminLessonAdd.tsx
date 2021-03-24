//React
import { useEffect, useState } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Modal, Button, Input } from "antd";

//Types
import { State } from "../../redux/types";

//Actions
import { getCourses } from "../../redux/slices/coursesSlice";
import {
  createLesson,
  closeLessonModel,
  openLessonModel,
} from "../../redux/slices/lessonSlice";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

//Component
const AdminLessonAdd = () => {
  const dispatch = useDispatch();
  const { posting, postingError, lessonModel } = useSelector(
    (state: State) => state.lesson
  );
  const { list, status } = useSelector((state: State) => state.courses);

  const [coursePicked, setCoursePicked] = useState<CoursePicked>({
    title: null,
    selected: false,
  });

  const [title, setTitle] = useState<string>("");
  const [videoLink, setVideoLink] = useState<string>("");
  const [subSlug, setSubSlug] = useState<string>("");
  const [body, setBody] = useState<EditorState>(EditorState.createEmpty());

  //Submit Lesson
  const handleOk = () => {
    dispatch(
      createLesson({
        title,
        body: JSON.stringify(convertToRaw(body.getCurrentContent())),
        videoLink,
        subSlug,
      })
    );
  };
  const handleCancel = () => {
    dispatch(closeLessonModel());
  };

  // Get Courses from state
  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);

  return (
    <>
      <Button type="primary" onClick={() => dispatch(openLessonModel())}>
        add lesson
      </Button>
      <Modal
        title="Add lesson"
        visible={lessonModel}
        onOk={handleOk}
        confirmLoading={posting}
        onCancel={handleCancel}
        width={"1000px"}
      >
        <form className="flex flex-col">
          <label className="font-bold">Title</label>
          <Input
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            type="text"
            disabled={posting}
            placeholder="title"
            name="title"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          <p className="text-right text-red-500">
            {postingError && postingError.title}
          </p>
          <label className="font-bold">Content</label>
          <div>
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
          <label className="font-bold">Link</label>
          <Input
            type="text"
            placeholder="Link"
            name="videoLink"
            className="w-full p-3 mb-3 border rounded-sm border-primary"
            value={videoLink}
            onChange={(e: any) => setVideoLink(e.target.value)}
          />
          <p className="text-right text-red-500">
            {postingError && postingError.videoLink}
          </p>

          <label className="font-bold">Course </label>

          <select
            className="w-full p-3 mb-3 border border-gray-300 rounded-sm"
            name=""
            id=""
            onChange={(e: any) => {
              setCoursePicked({
                title: e.target.value,
                selected: true,
              });
            }}
          >
            <option disabled selected>
              choose
            </option>
            {!status &&
              list.map((course) => {
                return (
                  <>
                    <option key={course.slug} value={course.name}>
                      {course.name}
                    </option>
                  </>
                );
              })}
          </select>
          <span className="text-right text-red-500">
            {postingError && postingError.subSlug}
          </span>
          {coursePicked.selected && (
            <>
              <label className="font-bold">Section</label>
              <select
                name=""
                id=""
                className="w-full p-3 mb-3 border border-gray-300 rounded-sm"
                onChange={(e) => setSubSlug(e.target.value)}
                disabled={!coursePicked.selected}
              >
                <option disabled selected>
                  choose
                </option>
                {list.map((course: any) =>
                  course.subs.map(
                    (sub) =>
                      course.name === coursePicked.title && (
                        <option key={sub.slug} value={sub.slug}>
                          {sub.title}
                        </option>
                      )
                  )
                )}
              </select>
              <p className="text-right text-red-500">
                {postingError && postingError.subSlug}
              </p>
            </>
          )}
        </form>
      </Modal>
    </>
  );
};

//types
interface CoursePicked {
  title: string | null;
  selected: boolean;
}
export default AdminLessonAdd;
