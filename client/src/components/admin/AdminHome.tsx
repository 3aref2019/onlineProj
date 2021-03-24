import { Button, Result, Spin } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getStatistics } from "../../redux/slices/statisticsSlice";
import { State } from "../../redux/types";

function AdminHome() {
  const dispatch = useDispatch();
  const { counts, error, loading } = useSelector(
    (state: State) => state.statistics
  );
  useEffect(() => {
    dispatch(getStatistics());
  }, [dispatch]);
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-col w-full mb-20 text-center">
          <h1 className="mb-4 text-2xl font-medium text-gray-900 sm:text-3xl title-font">
            Welcome to your dashboard
          </h1>
        </div>
        {loading ? (
          <Spin size="large" spinning />
        ) : error ? (
          <Result
            status="500"
            title="unexpected problem"
            extra={
              <Button type="primary" onClick={() => dispatch(getStatistics())}>
                reload page
              </Button>
            }
          />
        ) : (
          <div className="flex flex-wrap -m-4 text-center ">
            <div className="w-full p-4 md:w-1/4 sm:w-1/2 hover:shadow-md">
              <div className="px-4 py-6 border-2 border-gray-200 rounded-lg">
                <i className="text-7xl fas fa-chalkboard-teacher text-pacific-500"></i>
                <h2 className="text-3xl text-gray-900 font- title-font">
                  {counts.coursesCount}
                </h2>
                <Link to="/admin/course">
                  <p className="font-medium leading-relaxed">Courses</p>
                </Link>
              </div>
            </div>

            <div className="w-full p-4 md:w-1/4 sm:w-1/2 hover:shadow-md">
              <div className="px-4 py-6 border-2 border-gray-200 rounded-lg">
                <i className="text-7xl fas fa-puzzle-piece text-pacific-500"></i>
                <h2 className="text-3xl font-medium text-gray-900 title-font">
                  {counts.subsCount}
                </h2>
                <Link to="/admin/subcourse">
                  <p className="font-medium leading-relaxed">Sections</p>
                </Link>
              </div>
            </div>
            <div className="w-full p-4 md:w-1/4 sm:w-1/2 hover:shadow-md">
              <div className="px-4 py-6 border-2 border-gray-200 rounded-lg">
                <i className="text-7xl fab fa-readme text-pacific-500"></i>
                <h2 className="text-3xl font-medium text-gray-900 title-font">
                  {counts.lessonsCount}
                </h2>
                <Link to="/admin/lesson">
                  <p className="font-medium leading-relaxed">Lessons</p>
                </Link>
              </div>
            </div>
            <div className="w-full p-4 md:w-1/4 sm:w-1/2 hover:shadow-md">
              <div className="px-4 py-6 border-2 border-gray-200 rounded-lg">
                <i className="text-7xl fas fa-users text-pacific-500"></i>
                <h2 className="text-3xl font-medium text-gray-900 title-font">
                  {counts.usersCount}
                </h2>
                <Link to="/admin/user">
                  <p className="font-medium leading-relaxed">Users</p>
                </Link>
              </div>
            </div>
            <div className="w-full p-4 md:w-1/4 sm:w-1/2 hover:shadow-md">
              <div className="px-4 py-6 border-2 border-gray-200 rounded-lg">
                <i className="text-7xl far fa-newspaper text-pacific-500"></i>
                <h2 className="text-3xl font-medium text-gray-900 title-font">
                  {counts.articlesCount}
                </h2>
                <Link to="/admin/article">
                  <p className="font-medium leading-relaxed">Articles</p>
                </Link>
              </div>
            </div>
            <div className="w-full p-4 md:w-1/4 sm:w-1/2 hover:shadow-md">
              <div className="px-4 py-6 border-2 border-gray-200 rounded-lg">
                <i className="text-7xl fas fa-books text-pacific-500"></i>
                <i className="fas fa-book text-7xl text-pacific-500"></i>
                <h2 className="text-3xl font-medium text-gray-900 title-font">
                  {counts.booksCount}
                </h2>
                <Link to="/admin/books">
                  <p className="font-medium leading-relaxed">Books</p>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminHome;
