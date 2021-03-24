//React
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
//Redyx
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Breadcrumb, Image, Spin, Tooltip } from "antd";
//states
import { State } from "../../redux/types";
//Components
import PostSharing from "../Lesson/LessonSharing";
//Dayjs
import { formatDate, fromNow } from "../../utils/dayjsHelper";
import classnames from "classnames";
//actions
import { getCourse } from "../../redux/slices/courseSlice";
//types
interface ParamTypes {
  slug: string;
}
function Course() {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { slug } = useParams<ParamTypes>();
  useEffect(() => {
    dispatch(getCourse({ slug }));
  }, [pathname, slug, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const { course, loading } = useSelector((state: State) => state.course);
  const [description, setDescription] = useState(true);
  const [sections, setSections] = useState(false);
  return (
    <div className="container px-5 py-4">
      <div className="mb-2">
        {/* BREADCRUMB*/}
        <Breadcrumb>
          <Breadcrumb.Item href="">
            <Link to="/">
              Dashboard
              <i className="ml-2 fas fa-home"></i>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/c/courses">Courses</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {!loading && <span>{course.name}</span>}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {loading ? (
        <Spin size="large" spinning />
      ) : (
        <div className="col-span-4 p-1 bg-white md:col-span-3">
          <section className="overflow-hidden text-gray-600 body-font">
            <div className="px-5 py-12 mx-auto ">
              <div className="grid grid-cols-2 gap-5 mx-auto lg:w-4/5">
                <Image
                  alt="course"
                  className="col-span-2 md:col-span-1"
                  src={`http://localhost:5000/uploads/${course.imageUrn}`}
                />
                <div className="w-full col-span-2 mb-6 lg:pr-10 lg:py-6 lg:mb-0 md:col-span-1">
                  <h1 className="mb-4 text-3xl font-medium text-gray-900 title-font">
                    {course.name}
                  </h1>
                  <div className="flex mb-4">
                    <a
                      onClick={() => {
                        setDescription(true);
                        setSections(false);
                      }}
                      className={classnames(
                        "flex-grow px-1 py-2 text-lg border-b-2  ",
                        description
                          ? "border-pacific-500 text-pacific-500"
                          : "border-gray-300: text-gray-600"
                      )}
                    >
                      Description
                    </a>
                    <a
                      onClick={() => {
                        setDescription(false);
                        setSections(true);
                      }}
                      className={classnames(
                        "flex-grow px-1 py-2 text-lg border-b-2 ",
                        sections
                          ? "border-pacific-500 text-pacific-500"
                          : "border-gray-300 text-gray-600"
                      )}
                    >
                      Sections
                    </a>
                  </div>
                  {description ? (
                    <p className="mb-4 leading-relaxed">{course.description}</p>
                  ) : (
                    <div>
                      {course.subs.length > 0 ? (
                        course.subs.map((sub) => {
                          return (
                            <div className="p-3 my-2 bg-gray-200 rounded shadow-md cursor-pointer hover:bg-gray-300">
                              <Link to={`/s/${slug}/${sub.slug}`}>
                                <p className="font-medium">{sub.title}</p>
                              </Link>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-3 my-2 bg-gray-200 rounded shadow-md cursor-pointer ">
                          <p className="font-medium">
                            This course does not have any sections
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex">
                    <button className="flex px-6 py-2 ml-auto text-white border-0 rounded bg-pacific-500 focus:outline-none hover:bg-pacific-600">
                      Enroll
                    </button>
                    <button className="inline-flex items-center justify-center w-10 h-10 p-0 ml-4 text-gray-500 bg-gray-200 border-0 rounded-full">
                      <svg
                        fill="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      <PostSharing />
    </div>
  );
}
//types
interface ParamTypes {
  id: string;
}
export default Course;
