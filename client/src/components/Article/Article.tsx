//React
import React, { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
//Redyx
import { useDispatch, useSelector } from "react-redux";
//Antd
import { Breadcrumb, Spin } from "antd";
//states
import { State } from "../../redux/types";
//draftjs
import parse from "html-react-parser";
import draftToHTML from "draftjs-to-html";
//Components
import PostSharing from "../Lesson/LessonSharing";
//Dayjs
import { fromNow } from "../../utils/dayjsHelper";

//actions
import { getArticle } from "../../redux/slices/articleSlice";

function Article() {
  const { pathname } = useLocation();

  const dispatch = useDispatch();
  const { id } = useParams<ParamTypes>();
  useEffect(() => {
    dispatch(getArticle({ id }));
  }, [pathname, id, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const article = useSelector((state: State) => state.article);

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
            <Link to="/articles">Articles</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {!article.loading && <span>{article.article.title}</span>}
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {article.loading ? (
        <Spin size="large" spinning />
      ) : (
        <div className="col-span-4 p-1 bg-white md:col-span-3">
          <div className="flex-1 min-w-0 p-3 border border-gray-300 rounded-sm">
            {/* header */}
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl ">
              {article.article.title}
            </h2>
            <div className="flex flex-col mt-1 sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <i className="m-2 fas fa-user"></i>
                {article.article.username}
              </div>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <i className="flex-shrink-0 fas fa-clock mr-1.5 h-5 w-5 text-gray-400"></i>
                {fromNow(article.article.updatedAt)}
              </div>
            </div>
            {/* body */}
            <div className="mt-5">
              <div className="mb-4">
                {parse(draftToHTML(JSON.parse(article.article.body)))}
              </div>
              <hr />
            </div>
          </div>
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
export default Article;
