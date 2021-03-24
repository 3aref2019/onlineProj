import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

//USER
import authReducer from "./slices/authSlice";
//POST
import lessonsReducer from "./slices/lessonsSlice";
import lessonReducer from "./slices/lessonSlice";
//COURSE
import coursesReducer from "./slices/coursesSlice";
import courseReducer from "./slices/courseSlice";
//SUB
import subsReducer from "./slices/subsSlice";
import subReducer from "./slices/subSlice";
//USERS
import usersReducer from "./slices/usersSlice";
import userReducer from "./slices/userSlice";
//COMMENTS
import commentReducer from "./slices/commentSlice";
import commentsReducer from "./slices/commentsSlice";
//ARTICLES
import articleReducer from "./slices/articleSlice";
import articlesReducer from "./slices/articlesSlice";
//PROFILE
import profileReducer from "./slices/profileSlice";
//SEARCH
import searchReducer from "./slices/searchSlice";
//STATS
import statisticsReducer from "./slices/statisticsSlice";
//BOOKS
//ARTICLES
import bookReducer from "./slices/bookSlice";
import booksReducer from "./slices/booksSlice";
const reducer = {
  auth: authReducer,
  //
  lessons: lessonsReducer,
  lesson: lessonReducer,
  //
  courses: coursesReducer,
  course: courseReducer,
  //
  subs: subsReducer,
  sub: subReducer,
  //
  user: userReducer,
  users: usersReducer,
  //
  comment: commentReducer,
  comments: commentsReducer,
  //
  article: articleReducer,
  articles: articlesReducer,
  //
  profile: profileReducer,
  //
  search: searchReducer,
  //
  statistics: statisticsReducer,
  //
  book: bookReducer,
  books: booksReducer,
};

export default configureStore({
  reducer,
  middleware: [...getDefaultMiddleware()],
});
