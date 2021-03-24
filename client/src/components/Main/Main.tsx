//React
import React, { ReactElement, useEffect } from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Actions
import { getLatestCourses } from "../../redux/slices/coursesSlice";
import { getLessonsLimited } from "../../redux/slices/lessonsSlice";

//Types
import { State } from "../../redux/types";

//Components
import MainArticles from "./MainArticles";
import MainSearch from "./MainSearch";
import MainDescription from "./MainDescription";
import { getArticlesPaginated } from "../../redux/slices/articlesSlice";
import MainFeatures from "./MainFeatures";
import MainTeam from "./MainTeam";
import MainTests from "./MainTests";
import MainCoursesB from "./MainCoursesB";

const Main = (): ReactElement => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLatestCourses());
    dispatch(getLessonsLimited());
    dispatch(getArticlesPaginated({ current: 1 }));
  }, [dispatch]);

  const courses = useSelector((state: State) => state.courses);
  const articles = useSelector((state: State) => state.articles);
  return (
    <div>
      <div className="flex flex-col items-center ">
        <MainSearch />
        <MainDescription />
      </div>

      <MainCoursesB courses={courses.listLimited} />
      {/* <MainArticles
        articles={articles.listPaginated}
        status={articles.status}
      /> */}
      <MainArticles articles={articles.listPaginated} status={articles.status}/>
      <MainFeatures />
      <MainTeam />
      <MainTests />
    </div>
  );
};

export default Main;
