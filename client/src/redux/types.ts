// Auth
export interface Auth {
  user: any;
  isAuthenticated: boolean;
  loading: boolean;
  errorsLogin: any;
  errorsRegister: any;
  errorsLogout: any;
  errorsActivating: any;
  activating: boolean;
}
export interface Statistics {
  loading: boolean;
  counts: any;
  error: boolean;
}
//many
export interface Lessons {
  status: boolean;
  list: any[];
}
export interface Comments {
  status: boolean;
  list: any[];
}
export interface Users {
  status: boolean;
  list: any[];
}
export interface Search {
  status: boolean;
  results: any[];
  error: boolean;
}
export interface Courses {
  status: boolean;
  list: any[];
  listLimited: any[];
  error: boolean;
}

export interface Articles {
  status: boolean;
  list: any[];
  listPaginated: any[];
  error: boolean;
  infos: any;
}

export interface Books {
  status: boolean;
  list: any[];
  error: boolean;
}

export interface Subs {
  status: boolean;
  list: any[];
  filters: any;
}

//single
export interface Course {
  course: any; // course object
  loading: boolean; // loading course
  deleting: boolean; // loading delete course
  deletingError: any; // delete course errors
  updating: boolean; // loading update course
  updatingError: any; // update course errors
  posting: boolean; // adding course loading
  postingError: any; // adding course errors
  courseModel: boolean; // add course model
  editCourseModel: boolean; // update course model
  editCourseModelId: string | null;
}

export interface Article {
  article: any; // article object
  loading: boolean; // loading article
  deleting: boolean; // loading delete article
  deletingError: any; // delete article errors
  updating: boolean; // loading update article
  updatingError: any; // update article errors
  posting: boolean; // adding article loading
  postingError: any; // adding article errors
  articleModel: boolean; // add article model
  editArticleModel: boolean; // update Article model
  editArticleModelId: string | null;
}
export interface Book {
  book: any; // book object
  loading: boolean; // loading book
  deleting: boolean; // loading delete book
  deletingError: any; // delete book errors
  updating: boolean; // loading update book
  updatingError: any; // update book errors
  posting: boolean; // adding book loading
  postingError: any; // adding book errors
  bookModel: boolean; // add book model
  editBookModel: boolean; // update Book model
  editBookModelId: string | null;
}
export interface Lesson {
  lesson: any;
  loading: boolean;
  deleting: boolean;
  updating: boolean;
  deletingError: any;
  updatingError: any;
  posting: boolean;
  postingError: any;
  lessonModel: boolean;
  editLessonModel: boolean;
  editLessonModelId: string | null;
  notFound: boolean;
  loadingError: boolean;
}
export interface Comment {
  comment: any;
  loading: boolean;
  deleting: boolean;
  deletingError: any;
  commenting: boolean;
  commentingError: any;
  commentModel: boolean;
  editCommentModel: boolean;
  editCommentModelId: string | null;
  commentBody: string;
}
export interface Sub {
  sub: any; // sub object
  loading: boolean; // loading sub
  deleting: boolean; // loading delete sub
  deletingError: any; // delete sub errors
  updating: boolean; // loading update sub
  updatingError: any; // update sub errors
  posting: boolean; // adding sub loading
  postingError: any; // adding sub errors
  subModel: boolean; // add sub model
  editSubModel: boolean; // update sub model
  editSubModelId: null;
  shownLessons: number;
  notFound: boolean;
  loadingError: boolean;
}

export interface User {
  user: any; // sub object
  loading: boolean; // loading sub
  deleting: boolean; // loading delete sub
  deletingError: any; // delete sub errors
  updating: boolean; // loading update sub
  updatingError: any; // update sub errors
  posting: boolean; // adding sub loading
  postingError: any; // adding sub errors
  userModel: boolean; // add sub model
  editUserModel: boolean; // update sub model
  editUserModelId: null;
}

//Profile
export interface Profile {
  emailModal: boolean;
  passwordModal: boolean;
  updating: boolean;
  oldEmail: string;
  newEmail: string;
  errors: any;
  oldPassword: string;
  newPassword: string;
  bio: string;
  bioModal: boolean;
}
// Store Types
export interface State {
  auth: Auth;
  lessons: Lessons;
  lesson: Lesson;
  courses: Courses;
  course: Course;
  subs: Subs;
  sub: Sub;
  alerts: any;
  user: User;
  users: Users;
  comment: Comment;
  comments: Comments;
  article: Article;
  articles: Articles;
  profile: Profile;
  search: Search;
  statistics: Statistics;
  book: Book;
  books: Books;
}
