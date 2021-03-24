//React
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
//Redux
import { useDispatch, useSelector } from "react-redux";

//OTHER LIBRARIES
import parse from "html-react-parser";
import ReactPlayer from "react-player/lazy";

//Actions
import { getLesson } from "../../redux/slices/lessonSlice";
import { getPostCommentsAction } from "../../redux/slices/commentsSlice";
import {
  addCommentAction,
  resetCommentField,
  setCommentBody,
} from "../../redux/slices/commentSlice";
import { getSingleSubAction } from "../../redux/slices/subSlice";
//Types
import { State } from "../../redux/types";

//Days JS TODO seperate it to a single componnent
import { fromNow } from "../../utils/dayjsHelper";

//Antd
import {
  Breadcrumb,
  Alert,
  Button,
  Result,
  Spin,
  Divider,
  Tabs,
  Collapse,
} from "antd";

//DraftJS
import draftToHTML from "draftjs-to-html";

//Components
import SimilarPosts from "./LessonSimilars";
import PostSharing from "./LessonSharing";
import PostComments from "./LessonComment";
import NotFound from "../NotFound";
import SimilarLessonsMobile from "./LessonsSmiliarsMobile";

interface ParamTypes {
  identifier: string;
  slug: string;
  subSlug: string;
}
const { TabPane } = Tabs;
function Lesson() {
  const dispatch = useDispatch();
  //Params to use to get lesosn
  const { slug, identifier, subSlug } = useParams<ParamTypes>();
  const { lesson, loading, loadingError, notFound } = useSelector(
    (state: State) => state.lesson
  );

  const { list, status } = useSelector((state: State) => state.comments);
  const auth = useSelector((state: State) => state.auth);
  const sub = useSelector((state: State) => state.sub);
  const { commentBody, commentingError } = useSelector(
    (state: State) => state.comment
  );
  const [commentPicture, setCommentPicture] = useState<File | null>(null);

  useEffect(() => {
    loadLesson();
  }, [dispatch, identifier, slug, subSlug]);
  const loadLesson = () => {
    dispatch(getLesson({ identifier, slug }));
    dispatch(getPostCommentsAction({ identifier, slug }));
    dispatch(getSingleSubAction({ slug: subSlug }));
    dispatch(resetCommentField());
  };
  return (
    <div className="container py-4 ">
      <div className="mb-2">
        {/* BREADCRUMB*/}
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              HOMEPAGE
              <i className="ml-2 fas fa-home"></i>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {!loading && !loadingError && !notFound && (
              <span>{lesson.sub.courseName}</span>
            )}
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {!loading && !loadingError && !notFound && (
              <Link to={`/s/${lesson.sub.courseSlug}/${lesson.sub.slug}`}>
                <span>{lesson.sub.title}</span>
              </Link>
            )}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="grid grid-cols-4 gap-5 mx-auto ">
        {loading ? (
          <div className="flex items-center justify-center h-32 col-span-4 max-h">
            <Spin size="large" spinning />
          </div>
        ) : loadingError ? (
          <Result
            status="500"
            title="Problem loading page"
            extra={
              <Button type="primary" onClick={() => loadLesson()}>
                RELOAD
              </Button>
            }
          />
        ) : notFound ? (
          <div className="col-span-4 p-1 bg-white md:col-span-3">
            <NotFound />
          </div>
        ) : (
          <div className="col-span-4 p-1 bg-white md:col-span-3">
            <div className="flex-1 min-w-0 p-3 border border-gray-300 rounded-sm">
              {/* header */}
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl ">
                {lesson.title}
              </h2>
              <div className="flex flex-col mt-1 sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <i className="m-2 fas fa-user"></i>
                  {lesson.username}
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <i className="flex-shrink-0 fas fa-clock mr-1.5 h-5 w-5 text-gray-400"></i>
                  {fromNow(lesson.updatedAt)}
                </div>
              </div>
              {/* body */}
              <div className="mt-5 space-y-4">
                <div className="player-wrapper">
                  <ReactPlayer
                    controls
                    config={{
                      youtube: {
                        playerVars: { showinfo: 1 },
                      },
                    }}
                    url={`${lesson.videoLink}`}
                    width="100%"
                    height="100%"
                    className="react-player"
                  />
                </div>
                <div className="hidden md:block">
                  <p className="text-lg font-semibold">Description</p>
                  <div className="mb-4">
                    {parse(draftToHTML(JSON.parse(lesson.body)))}
                  </div>
                </div>
                <div className="block md:hidden">
                  <Collapse defaultActiveKey={["1"]}>
                    <Collapse.Panel header="Details" key="1">
                      <Tabs defaultActiveKey="2" >
                        <TabPane tab="Description" key="1">
                          <div className="mb-4">
                            {parse(draftToHTML(JSON.parse(lesson.body)))}
                          </div>
                        </TabPane>
                        <TabPane tab="Lessons" key="2">
                          {sub.loading ? (
                            <Spin size="large" spinning />
                          ) : (
                            <SimilarLessonsMobile
                              lessons={sub.sub.lessons}
                              lessonSlug={slug}
                            />
                          )}
                        </TabPane>
                      </Tabs>
                    </Collapse.Panel>
                  </Collapse>
                </div>
                <hr />
                <div className="flex flex-col gap-4 space-x-3"></div>
              </div>
            </div>
            <PostSharing />
            <div className="flex flex-col mt-10 ">
              <PostComments
                list={list}
                auth={auth}
                slug={slug}
                identifier={identifier}
                status={status}
              />
              {!auth.loading && auth.isAuthenticated ? (
                <>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-sm resize-none"
                    maxLength={250}
                    cols={7}
                    placeholder="write a comment..."
                    onChange={(e) => dispatch(setCommentBody(e.target.value))}
                    value={commentBody}
                  ></textarea>
                  {commentingError && commentingError.body && (
                    <p className="text-sm text-red-500">
                      {commentingError.body}
                    </p>
                  )}
                  <div className="flex flex-row justify-between mt-2 ">
                    <div className="flex items-center justify-center w-24 bg-gray-100">
                      <label className="flex flex-col items-center w-64 tracking-wide text-blue-500 uppercase bg-white border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                        <i className="mt-1 fas fa-upload"></i>
                        <span className="text-sm leading-normal ">
                          attach file
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files)
                              setCommentPicture(e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>

                    <button
                      className="relative h-8 font-normal text-white transition duration-500 ease-in-out bg-blue-500 border-b-4 border-solid shadow-sm w-44 hover:shadow-lg"
                      onClick={() => {
                        dispatch(
                          addCommentAction({
                            identifier,
                            slug,
                            body: commentBody,
                            picture: commentPicture,
                          })
                        );
                        setCommentPicture(null);
                      }}
                    >
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <i className="fas fa-paper-plane"></i>
                      </span>

                      <span className="text-sm ">SEND</span>
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <Alert
                    message={
                      <p>
                        <span className="ml-1">You need to </span>
                        <Link to="/register" className="font-bold">
                          {" "}
                          <span className="ml-1"> REGISTER </span>
                        </Link>
                        or{" "}
                        <Link to="/login" className="font-bold">
                          {" "}
                          <span className="ml-1"> LOGIN </span>
                        </Link>
                        <span className="ml-1"> to add a comment </span>
                      </p>
                    }
                    type="info"
                    showIcon
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="hidden col-span-1 bg-white md:block ">
          {sub.loading ? (
            <Spin size="large" spinning />
          ) : (
            <SimilarPosts lessons={sub.sub.lessons} lessonSlug={slug} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Lesson;
