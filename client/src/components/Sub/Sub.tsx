import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
import { State } from "../../redux/types";
import { getSingleSubAction } from "../../redux/slices/subSlice";
import PostComponent from "../shared/sub/PostComponent";
import { Result, Button, Breadcrumb, Menu, Dropdown, Spin } from "antd";
import { getCourse } from "../../redux/slices/courseSlice";
import { DownOutlined } from "@ant-design/icons";
import NotFound from "../NotFound";

interface ParamTypes {
  subSlug: string;
  courseSlug: string;
}

const Sub = () => {
  //history
  const history = useHistory();
  //get params
  const { subSlug, courseSlug } = useParams<ParamTypes>();
  //Redux states & actions
  const dispatch = useDispatch();
  useEffect(() => {
    load();
  }, [subSlug, courseSlug, dispatch]);
  const load = () => {
    dispatch(getSingleSubAction({ slug: subSlug }));
    dispatch(getCourse({ slug: courseSlug }));
  };
  const { loading, sub, shownLessons, loadingError, notFound } = useSelector(
    (state: State) => state.sub
  );
  const course = useSelector((state: State) => state.course);
  return (
    <div className="container mx-auto my-12 lg:px-12 ">
      <div className="mb-2 ml-2">
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
              <>
                <Breadcrumb.Item>
                  <Link to={`/c/courses/${sub.courseSlug}`}>
                    {sub.courseName}
                  </Link>{" "}
                  /{" "}
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Dropdown
                    trigger={["click"]}
                    overlay={() => (
                      <Menu>
                        {!course.loading &&
                          course.course.subs.map((sub) => {
                            return (
                              <Menu.Item key={sub.slug}>
                                <Link
                                  className="m-3"
                                  to={`/s/${course.course.slug}/${sub.slug}`}
                                >
                                  {sub.title}
                                </Link>
                              </Menu.Item>
                            );
                          })}
                      </Menu>
                    )}
                  >
                    <span className="cursor-pointer">
                      {!loading && sub.title} <DownOutlined />
                    </span>
                  </Dropdown>
                </Breadcrumb.Item>
              </>
            )}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div>
        <div className="flex flex-col w-full ">
          {loading ? (
            <div className="flex items-center justify-center h-32 col-span-4 max-h">
              <Spin size="large" spinning />
            </div>
          ) : loadingError ? (
            <Result
              status="500"
              title="Problem loading page"
              extra={
                <Button type="primary" onClick={() => load()}>
                  RELOAD
                </Button>
              }
            />
          ) : notFound ? (
            <div className="col-span-4 p-1 bg-white md:col-span-3">
              <NotFound />
            </div>
          ) : sub.lessons.length === 0 || shownLessons === 0 ? (
            <>
              <Result
                status="info"
                title="This section is empty"
                subTitle="visit it later..."
                extra={
                  <Button
                    type="primary"
                    onClick={() => history.push(`/c/courses/${sub.courseSlug}`)}
                  >
                    GO BACK
                  </Button>
                }
              />
            </>
          ) : (
            sub.lessons.map(
              (lesson) =>
                lesson.displayStatus && (
                  <div
                    key={lesson.id}
                    className="flex flex-col justify-between px-1 py-2 mx-5 mb-4 bg-gray-100 border-t-2 border-b-2 border-l-2 border-r-8 border-gray-500 md:flex-row justify-items-center"
                  >
                    <PostComponent
                      identifier={lesson.identifier}
                      slug={lesson.slug}
                      title={lesson.title}
                      updatedAt={lesson.updatedAt}
                      subSlug={subSlug}
                    />
                  </div>
                )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Sub;
