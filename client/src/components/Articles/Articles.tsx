//React
import React, { useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
//Redux
import { useDispatch, useSelector } from "react-redux";

//Types
import { State } from "../../redux/types";

//Components

//Antd
import { Breadcrumb, Button, Result, Pagination, Spin } from "antd";

//Actions
import {
  getArticles,
  getArticlesPaginated,
} from "../../redux/slices/articlesSlice";
function Article() {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { error, status, infos, listPaginated } = useSelector(
    (state: State) => state.articles
  );
  const query =
    location.search !== ""
      ? JSON.parse(
          '{"' +
            location.search
              .substring(1)
              .replace(/&/g, '","')
              .replace(/=/g, '":"') +
            '"}',
          function (key, value) {
            return key === "" ? value : decodeURIComponent(value);
          }
        )
      : { current: 1 };
  useEffect(() => {
    dispatch(
      getArticlesPaginated({
        current: Number(query.current),
      })
    );
  }, [dispatch, query.current]);
  return (
    <div className="container px-5 py-4 ">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">
            Homepage
            <i className="ml-2 fas fa-home"></i>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Articles</Breadcrumb.Item>
      </Breadcrumb>
      {status ? (
        <div className="flex items-center justify-center h-96">
          <Spin size="large" spinning />
        </div>
      ) : error ? (
        <Result
          status="500"
          title="unexpected problem"
          extra={
            <Button type="primary" onClick={getArticles}>
              reload page
            </Button>
          }
        />
      ) : listPaginated.length === 0 ? (
        <>
          <Result
            status="info"
            title="There's no articles"
            subTitle="try again later.."
            extra={
              <Button type="primary">
                <Link to="/">return</Link>
              </Button>
            }
          />
        </>
      ) : (
        <div className="flex flex-col items-center ">
          {listPaginated.map((article) => (
            <article
              key={article.id}
              className="relative grid-cols-5 mt-4 border border-gray-300 rounded-lg shadow-sm border-opacity-60 sm:grid p-7 lg:max-w-2xl sm:p-4 lg:col-span-2 lg:ml-20"
            >
              <img
                src={`http://localhost:5000/uploads/${article.imageUrn}`}
                alt={article.imageUrn}
                className="object-cover w-full rounded-lg max-h-32"
              />
              <div className="self-center col-span-3 pt-5 sm:pt-0 sm:pl-10">
                <h2 className="mr-3 text-xl font-bold text-gray-800 capitalize">
                  <Link to={`/articles/${article.id}`}>{article.title}</Link>
                </h2>
                <Link to="/" className="inline-block pt-2 mr-3 capitalize">
                  {article.username}
                </Link>
              </div>
              <div className="justify-self-end">
                <img
                  src="https://cdn4.iconfinder.com/data/icons/app-custom-ui-1/48/Bookmark-256.png"
                  alt="Bookmark"
                  className="absolute w-8 top-3 right-3 sm:relative sm:top-0 sm:right-0"
                />
              </div>
            </article>
          ))}
          <div className="flex justify-center mt-2">
            {!status && !error && (
              <Pagination
                current={infos.current_page}
                total={infos.total_results}
                pageSize={infos.total_pages}
                hideOnSinglePage
                defaultCurrent={1}
                onChange={(current) => {
                  if (current < query.current) {
                    history.push(`/articles?current=${current}`);
                    dispatch(
                      getArticlesPaginated({
                        current: Number(query.current),
                      })
                    );
                  } else {
                    history.push(`/articles?current=${current}`);
                    dispatch(
                      getArticlesPaginated({
                        current: Number(query.current),
                      })
                    );
                  }
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Article;
//
