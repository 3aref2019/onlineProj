import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { fromNow } from "../../utils/dayjsHelper";


const  MainLatestPosts = ({ posts }) : ReactElement=>  {
  return (
    <div className="col-span-1 p-2 m-2 space-x-3 space-y-3 bg-white shadow-md">
      <div>
        <p className="mb-2 text-2xl">Latest Lessons</p>
      </div>
      <div className="space-y-3">
        {posts.map(
          ({ id, title, slug, identifier, subSlug, updatedAt, username }) => (
            <div className="mb-1" key={id}>
              <p className="text-base text-gray-800">
                <Link to={`/p/${subSlug}/${identifier}/${slug}`}>{title}</Link>
              </p>
              <p className="text-xs text-gray-400">
                من طرف <span className="text-gray-500">{username}</span>{" "}
                {fromNow(updatedAt)}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MainLatestPosts;
