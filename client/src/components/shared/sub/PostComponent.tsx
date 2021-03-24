import React from "react";
import { Tooltip } from "antd";
import { Link } from "react-router-dom";
import { formatDate, fromNow } from "../../../utils/dayjsHelper";

function PostComponent({ updatedAt, title, slug, identifier, subSlug }) {
  return (
    <>
      <div className="w-full mx-4">
        <div className="flex flex-row ">
          <i className="mr-2 fas fa-clock"></i>
          <span className="flex flex-col mt-auto text-xs text-gray-400 ">
            <Tooltip placement="top" title={formatDate(updatedAt)}>
              {fromNow(updatedAt)}
            </Tooltip>
          </span>
        </div>
        <p className="mb-2 text-lg font-semibold text-gray-700">
          <Link to={`/p/${subSlug}/${identifier}/${slug}`}>{title}</Link>
        </p>
      </div>
      
    </>
  );
}

export default PostComponent;
