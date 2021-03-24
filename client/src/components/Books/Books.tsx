//React
import { Breadcrumb, Button, Result, Spin } from "antd";
import { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getBooks } from "../../redux/slices/booksSlice";
import { State } from "../../redux/types";
import {  fromNow } from "../../utils/dayjsHelper";

const Books = (): ReactElement => {
  const books = useSelector((state: State) => state.books);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBooks());
  }, [dispatch]);
  return (
    <section className="container p-4">
      {!books.status && !books.error && (
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              Homepage
              <i className="ml-2 fas fa-home"></i>
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Books</Breadcrumb.Item>
        </Breadcrumb>
      )}
      <div className="flex flex-wrap justify-center flex-grow-0">
        {books.status ? (
          <Spin size="large" spinning />
        ) : books.error ? (
          <Result
            status="500"
            title="A problem has occured"
            extra={
              <Button type="primary" onClick={() => dispatch(getBooks())}>
                إعادة تحميل الصفحة
              </Button>
            }
          />
        ) : books.list.length === 0 ? (
          <>
            <Result
              status="info"
              title="There's no books"
              subTitle="try again later.."
              extra={
                <Button type="primary">
                  <Link to="/">HOMEPAGE</Link>
                </Button>
              }
            />
          </>
        ) : (
          books.list.map((book) => (
            <div className="w-full m-2 overflow-hidden bg-white border-b-4 border-blue-500 shadow-sm hover:shadow-lg hover:bg-gray-200 lg:w-3/12 md:w-5/12">
              <img
                src={`http://localhost:5000/uploads/${book.imageUrn}`}
                alt="People"
                className="object-cover w-full h-32 sm:h-48 md:h-64"
              />
              <div className="p-1 md:p-4">
                <h3 className="mb-2 text-xl font-semibold leading-tight cursor-pointer sm:leading-normal">
                  <Link to={`/books/${book.slug}`}>{book.title}</Link>
                </h3>

                <div className="flex text-sm">
                  <i className="mr-2 fas fa-clock"></i>{" "}
                  <p className="leading-none">{fromNow(book.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Books;
