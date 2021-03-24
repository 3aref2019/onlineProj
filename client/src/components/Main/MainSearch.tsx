//React
import { ReactElement, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
//Redux
import { useDispatch, useSelector } from "react-redux";
//Actions
import { searchCourse } from "../../redux/slices/searchSlice";
//Types
import { State } from "../../redux/types";
//Utils
import reactStringReplace from "react-string-replace";

//Component
const MainSearch = (): ReactElement => {
  const dispatch = useDispatch();
  const { status, results, error } = useSelector(
    (state: State) => state.search
  );
  const [query, setQuery] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const searchSubs = useCallback(async () => {
    if (timer !== null) clearTimeout(timer);
    setTimer(
      setTimeout(async () => {
        dispatch(searchCourse({ query: query }));
      }, 500)
    );
  }, [query, dispatch, timer]);
  useEffect(() => {
    searchSubs();
  }, [query, dispatch]);

  return (
    <div className="flex justify-center w-2/3 md:w-full ">
      <form className="relative w-full px-2 py-2 mx-2 mt-5 bg-white border border-gray-300 rounded md:w-3/6">
        <div className="text-gray-600 focus-within:text-gray-400">
          <span className="absolute inset-y-0 left-0 flex items-center pl-2">
            <svg
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="w-6 h-6 text-indigo-500"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input
            type="text"
            name="q"
            className="py-2 pl-10 text-sm focus:outline-none "
            placeholder="find courses ..."
            autoComplete="off"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          {query === "" ? (
            <></>
          ) : (
            <div
              className="absolute left-0 right-0 w-full transition-all bg-white border border-blue-400 shadow-md"
              style={{ top: "100%" }}
            >
              {(!status && error) || results.length === 0 ? (
                <p className="p-1 ml-2 text-gray-500">no results were found</p>
              ) : (
                <>
                  <span className="p-2 text-gray-600">
                    {results?.length > 1 ? results?.length + " results were found" : results?.length + " result were found"} 
                  </span>
                  {results?.map((result) => {
                    return (
                      <div
                        key={result.slug}
                        className="flex flex-col px-4 py-3 transition-all bg-gray-100 cursor-pointer hover:bg-gray-300"
                      >
                        <div className="mr-4 text-sm">
                          <Link
                            to={`/c/courses/${result.slug}`}
                          >
                            <p className="font-medium ">
                              {generateHighlightedText(result.name, query)}
                            </p>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

// Hightlight text search
const generateHighlightedText = (caption, searchValue) =>
  searchValue
    ? reactStringReplace(caption, searchValue, (match, i) => (
        <Highlighted key={i} word={match} />
      ))
    : caption;

const Highlighted = ({ word }) => (
  <span className="font-semibold text-blue-600">{word}</span>
);

export default MainSearch;

/**
 *
 *
 */
