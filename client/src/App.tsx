//React
import React, { useEffect } from "react";

//Redux
import { useDispatch } from "react-redux";

//React Router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

//Antd
import { BackTop } from "antd";
//Actions
import { getUserOnLoadThunk } from "./redux/slices/authSlice";

//Toastifiy
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/register";
import Sub from "./components/Sub/Sub";
import Main from "./components/Main/Main";
import Lesson from "./components/Lesson/Lesson";
import Articles from "./components/Articles/Articles";
import Article from "./components/Article/Article";
import Profile from "./components/Profile/Profile";
import VerifyEmail from "./components/VerifyEmail";
import Courses from "./components/Courses/Courses";

//AdminDashboardComponents
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminCourse from "./components/admin/AdminCourse";
import AdminSubCourse from "./components/admin/AdminSubCourse";
import AdminLesson from "./components/admin/AdminLesson";
import AdminComment from "./components/admin/AdminComment";
import AdminArticle from "./components/admin/AdminArticle";
import AdminUser from "./components/admin/AdminUser";
//Global Styles
import "./index.css";

//Layout
import MainLayout from "./components/shared/MainLayout";

import NotFound from "./components/NotFound";

import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import PrivateRouteEditor from "./components/PrivateRouteEditor";
import PrivateRouteUser from "./components/PrivateRouteUser";
import PrivateRouteGuest from "./components/PrivateRouteGuest";

import ScrollToTop from "./components/shared/ScrollToTop";
import axios from "axios";
import Course from "./components/Course/Course";
import AdminHome from "./components/admin/AdminHome";
import AdminQuiz from "./components/admin/AdminQuiz";
import AdminBook from "./components/admin/AdminBook";
import Books from "./components/Books/Books";
import Book from "./components/Book/Book";

axios.defaults.withCredentials = true;
// APP
export default function App() {
  // Hooks
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserOnLoadThunk());
  }, [dispatch]);

  return (
    <Router>
      <BackTop />
      <ScrollToTop />
      <ToastContainer
        draggable
        className="w-2/3 mt-10 md:w-1/3"
        limit={3}
        hideProgressBar
      />
      <Switch>
        <Route path="/admin/:path?" exact component={AdminRoutes} />
        <Route>
          <MainLayout>
            <Switch>
              {/* Guest Only */}
              <PrivateRouteGuest
                exact
                path="/register"
                component={Register}
                key="_register"
              />
              <PrivateRouteGuest
                exact
                path="/login"
                key="_login"
                component={Login}
              />
              {/* Any */}
              <Route exact path="/" component={Main} key="_main" />
              <Route
                exact
                path="/c/courses"
                component={Courses}
                key="_courses"
              />
              <Route
                exact
                path="/c/courses/:slug"
                component={Course}
                key="_courses"
              />
              <Route
                exact
                path="/s/:courseSlug/:subSlug"
                component={Sub}
                key="_sub"
              />
              <Route
                path="/p/:subSlug/:identifier/:slug"
                component={Lesson}
                key="_lesson"
              />
              <Route
                exact
                path="/articles"
                component={Articles}
                key="_articles"
              />
              <Route
                exact
                path="/articles/:id"
                component={Article}
                key="_article"
              />
                 <Route
                exact
                path="/books"
                component={Books}
                key="_books"
              />
              <Route
                exact
                path="/books/:slug"
                component={Book}
                key="_book"
              />
              <PrivateRouteUser
                exact
                path="/profile"
                component={Profile}
                key="_profile"
              />
              <PrivateRouteUser
                exact
                path="/verifyEmail/:token"
                component={VerifyEmail}
                key="_profile"
              />
              <Route exact path="/*" component={NotFound} key="_notfound" />
              {/* User Only */}
            </Switch>
          </MainLayout>
        </Route>
      </Switch>
    </Router>
  );
}

const AdminRoutes = () => {
  return (
    <AdminDashboard>
      <Switch>
        <PrivateRouteEditor exact path="/admin/home" component={AdminHome}  key="_admin_home" />
        <PrivateRouteEditor
          exact
          path="/admin/course"
          component={AdminCourse}
          key="_admin_course"
        />
        <PrivateRouteEditor
          exact
          path="/admin/subcourse"
          component={AdminSubCourse}
          key="_admin_subcourse"
        />
        <PrivateRouteEditor
          exact
          path="/admin/lesson"
          component={AdminLesson}
        />
        <PrivateRouteEditor
          exact
          path="/admin/comment"
          component={AdminComment}
          key="_admin_comment"
        />
        <PrivateRouteEditor
          exact
          path="/admin/article"
          component={AdminArticle}
          key="_admin_article"
        />
         <PrivateRouteEditor
          exact
          path="/admin/books"
          component={AdminBook}
          key="_admin_books"
        />
        <PrivateRouteAdmin
          exact
          path="/admin/user"
          component={AdminUser}
          key="_admin_user"
        />
        <PrivateRouteAdmin
          exact
          path="/admin/quiz"
          component={AdminQuiz}
          key="_admin_quiz"
        />
      </Switch>
    </AdminDashboard>
  );
};
