//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRD PARTY
import axios from "axios";
import { toast } from "react-toastify";
//TYPES
import { Course } from "../types";
//ACTIONS
import { getCourses } from "./coursesSlice";

export const getCourse = createAsyncThunk(
  "course/getCourse",
  async ({ slug }: { slug: string }) => {
    const res = await axios.get(
      `http://localhost:5000/api/subs/course/${slug}`
    );
    return res.data;
  }
);

//!Add course
export const createCourse = createAsyncThunk(
  "course/createCourse",
  async (
    {
      name,
      description,
      picture,
    }: {
      name: string;
      description: string;
      picture: File | null;
    },
    { rejectWithValue, dispatch }
  ) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (picture) formData.append("picture", picture);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/subs/course`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success("Course added succefully");
      dispatch(getCourses());
      return res.data;
    } catch (error) {
      toast.error("a problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!UPDATE COURSE
export const updateCourse = createAsyncThunk(
  "course/updateCourse",
  async (
    {
      name,
      description,
      slug,
      apperance_order,
    }: {
      name: string;
      slug: string;
      description: string;
      apperance_order: number;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      name,
      description,
      apperance_order,
    };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/subs/course/${slug}`,
        data,
        {
          withCredentials: true,
        }
      );
      toast.success("Course edited succefully.");

      dispatch(getCourses());
      return res.data;
    } catch (error) {
      toast.error("a problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "course/deleteCourse",
  async ({ slug }: { slug: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/subs/course/${slug}`
      );
      dispatch(getCourses());
      toast.success("Course deleted succefully.");
      return res.data;
    } catch (error) {
      toast.error("a problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//Initial State
const courseInitialState: Course = {
  course: null, // course object
  loading: true, // loading course
  deleting: false, // loading delete course
  deletingError: {}, // delete course errors
  updating: false, // loading update course
  updatingError: {}, // update course errors
  posting: false, // adding course loading
  postingError: {}, // adding course errors
  courseModel: false, // add course model
  editCourseModel: false, // update course model
  editCourseModelId: null,
};
//Reducer
const courseSlice = createSlice({
  name: "course",
  initialState: courseInitialState,
  reducers: {
    openCourseModel(state) {
      state.courseModel = true;
    },
    closeCourseModel(state) {
      state.courseModel = false;
    },
    openEditCourseModel(state, { payload }) {
      state.editCourseModel = true;
      state.editCourseModelId = payload.id;
    },
    closeEditCourseModel(state) {
      state.editCourseModel = false;
      state.editCourseModelId = null;
    },
  },
  extraReducers: {
    //?------------------------------GET COURSE------------------
    //*pending------------------------------
    [getCourse.pending as any]: (state) => {
      state.loading = true;
    },
    //*fulfilled------------------------------
    [getCourse.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.course = payload;
    },
    //*rejected------------------------------
    [getCourse.rejected as any]: (state) => {
      state.loading = false;
    },
    //?------------------------------Add Course------------------
    //*pending------------------------------
    [createCourse.pending as any]: (state) => {
      state.postingError = {};
      state.posting = true;
    },
    //*fulfilled------------------------------
    [createCourse.fulfilled as any]: (state) => {
      state.posting = false;
      state.courseModel = false;
    },
    //*rejected------------------------------
    [createCourse.rejected as any]: (state, action) => {
      state.postingError = JSON.parse(action.payload);
      state.posting = false;
    },
    //?------------------------------Edit Course------------------
    //*pending------------------------------
    [updateCourse.pending as any]: (state) => {
      state.updatingError = {};
      state.updating = true;
    },
    //*fulfilled------------------------------
    [updateCourse.fulfilled as any]: (state) => {
      state.updating = false;
      state.editCourseModel = false;
    },
    //*rejected------------------------------
    [updateCourse.rejected as any]: (state, action) => {
      state.updatingError = JSON.parse(action.payload);
      state.updating = false;
    },
    //?------------------------------DELETE Course------------------
    [deleteCourse.pending as any]: (state) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteCourse.fulfilled as any]: (state) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteCourse.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
  },
});
export const {
  closeCourseModel,
  closeEditCourseModel,
  openCourseModel,
  openEditCourseModel,
} = courseSlice.actions;
export default courseSlice.reducer;
