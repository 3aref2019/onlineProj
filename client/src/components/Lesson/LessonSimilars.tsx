//React
import React, { ReactElement } from "react";
import { Link } from "react-router-dom";

//Dayjs

const SimilarLessons = ({ lessons, lessonSlug }): ReactElement => {
  return (
    <div className="col-span-1 p-2 m-2 space-x-3 space-y-3 bg-white shadow-md">
      <div>
        <p className="mb-2 text-xl">SECTION LESSONS</p>
      </div>
      <div className="space-y-3">
        {lessons.map(({ id, title, slug, identifier, subSlug }) => (
          <div className="mb-1" key={id} shadow-sm>
            <p className="text-base text-gray-800">
              {slug === lessonSlug ? (
                <p className="text-blue-400">
                  <i className="mr-1 text-xs text-blue-400 fas fa-play"></i> 
                  {title}
                </p>
              ) : (
                <Link to={`/p/${subSlug}/${identifier}/${slug}`}>{title}</Link>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarLessons;
