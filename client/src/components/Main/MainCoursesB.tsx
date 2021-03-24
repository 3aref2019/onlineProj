import { Carousel } from "antd";
import React from "react";
import { Link, Router, useHistory } from "react-router-dom";
function MainCoursesB({ courses }) {
  const history = useHistory();
  console.log(courses);
  return (
    <section className="py-12 text-white body-font bg-brand">
      <div className="w-20 h-1 bg-white"></div>
      <div className="w-10 h-1 mt-2 bg-white"></div>
      <div className="container px-5 pb-12 mx-auto">
        <div className="flex flex-col w-full text-center">
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-center text-white sm:text-4xl">
            Latest Courses
          </p>
        </div>
        <div className="justify-center hidden grid-cols-6 gap-2 justify-items-center md:grid">
          {courses.map((course) => (
            <div className="w-full col-span-6 bg-white shadow-lg lg:col-span-2 md:col-span-3 ">
              <div className="relative flex ">
                <div className="relative z-10 w-full ">
                  <div
                    className="object-cover w-full h-40 bg-center bg-cover "
                    style={{
                      backgroundImage: `url(http://localhost:5000/uploads/${course.imageUrn})`,
                    }}
                  ></div>
                  <h1 className="mb-3 text-lg font-medium text-center text-black title-font">
                    {course.name}
                  </h1>
                </div>
                <Link to={`/c/courses/${course.slug}`}>
                  <img
                    alt="gallery"
                    className="absolute inset-0 z-30 flex items-center justify-center object-cover w-full h-full transition-all bg-gray-700 bg-opacity-50 opacity-0 cursor-pointer hover:opacity-70"
                    src="https://www.creativefabrica.com/wp-content/uploads/2019/12/11/play-button-icon-Graphics-1-8-580x386.jpg"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="block py-4 mx-4 md:hidden" >
          <Carousel dotPosition="top" slidesToScroll={1} swipeToSlide>
            {courses.map((course) => (
              <div className="w-full col-span-6 bg-white shadow-lg lg:col-span-2 md:col-span-3 ">
                <div className="relative flex ">
                  <div className="relative z-10 w-full ">
                    <div
                      className="object-cover w-full h-40 bg-center bg-cover "
                      style={{
                        backgroundImage: `url(http://localhost:5000/uploads/${course.imageUrn})`,
                      }}
                    ></div>
                    <Link to={`/c/courses/${course.slug}`}>
                      <h1
                        onClick={() => history.push("/c/courses")}
                        className="mb-3 text-lg font-medium text-center text-black cursor-pointer title-font"
                      >
                        {course.name}
                      </h1>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

export default MainCoursesB;
