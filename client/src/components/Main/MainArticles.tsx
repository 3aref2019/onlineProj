//React
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { fromNow } from "../../utils/dayjsHelper";

const MainArticles = ({ articles, status }): ReactElement => {
  console.log(articles, status);

  return (
    <section className="py-12 text-gray-600">
      <div className="w-20 h-1 bg-brand"></div>
      <div className="w-10 h-1 mt-2 bg-brand"></div>
      <div className="container px-5 pb-12 mx-auto">
        <div className="flex flex-col w-full text-center">
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-center text-brand sm:text-4xl">
            Latest Articles
          </p>
        </div>
        <div className="grid grid-cols-6">
          {articles.map((article) => (
            <div className="w-full col-span-6 px-8 py-6 border-l-2 border-gray-200 md:col-span-3 lg:col-span-2 border-opacity-60">
              <h2 className="mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font">
                {article.title}
              </h2>
              <p className="mb-4 text-base leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab
                asperiores ullam doloribus esse! Velit, impedit nulla rem sed
                enim eveniet quisquam sint architecto, eaque, vero magnam optio
                aperiam eius ad!
              </p>
              <a className="inline-flex items-center text-blue-500">
                <Link to={`/articles/${article.id}`}>Read</Link>
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainArticles;
