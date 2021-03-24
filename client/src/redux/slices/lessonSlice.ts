import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { Lesson } from "../types";
import { getLessons } from "./lessonsSlice";


//! GET LESSON
export const getLesson = createAsyncThunk(
  "lesson/getLesson",
  async (
    { identifier, slug }: { identifier: string; slug: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/posts/${identifier}/${slug}`
      );
      return res.data;
    } catch (error) {
      if(error.response.statusText === "Not Found"){
        return rejectWithValue("not found");
      }else{
        return rejectWithValue("server error");
      }
    }
  }
);

//!CREATE LESSON
export const createLesson = createAsyncThunk(
  "lesson/createLesson",
  async (
    {
      title,
      body,
      videoLink,
      subSlug,
    }: {
      title: string;
      body: string;
      videoLink: string;
      subSlug: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      title,
      body,
      videoLink,
      subSlug,
    };
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/`, data, {
        withCredentials: true,
      });

      toast.success("Lesson added succefully.");
      dispatch(getLessons());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!UPDATE LESSON
export const updateLesson = createAsyncThunk(
  "lesson/updateLesson",
  async (
    {
      title,
      body,
      videoLink,
      slug,
      identifier,
    }: {
      title: string;
      body: string;
      videoLink: string;
      slug: string;
      identifier: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      title,
      body,
      videoLink,
    };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/update/${identifier}/${slug}`,
        data,
        {
          withCredentials: true,
        }
      );

      toast.success("Lesson edited succefully.");

      dispatch(getLessons());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!CHANGE LESSON DISPLAY HIDE/SHOW
export const changeLessonDisplayStatus = createAsyncThunk(
  "lesson/changeLessonDisplayStatus",
  async (
    {
      slug,
      identifier,
    }: {
      slug: string;
      identifier: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/display/${identifier}/${slug}`,
        null,
        {
          withCredentials: true,
        }
      );

      toast.success("Lesson edited succefully.");

      dispatch(getLessons());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "lesson/deleteLesson",
  async (
    { identifier, slug }: { identifier: string; slug: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/posts/${identifier}/${slug}`
      );
      dispatch(getLessons());
      toast.success("Lesson deleted succefully.");
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
const lessonInitialState: Lesson = {
  lesson: null, // lesson object
  loading: true, // loading lesson
  deleting: false, // loading delete lesson
  deletingError: {}, // delete lesson errors
  updating: false, // loading update lesson
  updatingError: {}, // update lesson errors
  posting: false, // adding lesson loading
  postingError: {}, // adding lesson errors
  lessonModel: false, // add lesson model
  editLessonModel: false, // update lesson model
  editLessonModelId: null,
  notFound: false,
  loadingError: false,
};
//RTK

const lessonSlice = createSlice({
  name: "lesson",
  initialState: lessonInitialState,
  reducers: {
    openLessonModel(state) {
      state.lessonModel = true;
    },
    closeLessonModel(state) {
      state.lessonModel = false;
    },
    openEditLessonModel(state, { payload }) {
      state.editLessonModel = true;
      state.editLessonModelId = payload.id;
    },
    closeEditLessonModel(state) {
      state.editLessonModel = false;
      state.editLessonModelId = null;
    },
  },
  extraReducers: {
    //?------------------------------GET LESSON------------------
    //*pending------------------------------
    [getLesson.pending as any]: (state) => {
      state.loading = true;
      state.notFound = false;
      state.loadingError = false;
    },
    //*fulfilled------------------------------
    [getLesson.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.lesson = payload;
      state.loadingError = false;
      state.notFound = false;
    },
    //*rejected------------------------------
    [getLesson.rejected as any]: (state, {payload}) => {
      state.loading = false;
      if (payload === "not found") {
        state.notFound = true;
      } else {
        state.loadingError = true;
      }
    },
    //?------------------------------Add LESSON------------------
    //*pending------------------------------
    [createLesson.pending as any]: (state, _action) => {
      state.postingError = {};
      state.posting = true;
    },
    //*fulfilled------------------------------
    [createLesson.fulfilled as any]: (state) => {
      state.posting = false;
      state.lessonModel = false;
    },
    //*rejected------------------------------
    [createLesson.rejected as any]: (state, action) => {
      state.postingError = JSON.parse(action.payload);
      state.posting = false;
    },
    //?------------------------------Edit LESSON------------------
    //*pending------------------------------
    [updateLesson.pending as any]: (state, _action) => {
      state.updatingError = {};
      state.updating = true;
    },
    //*fulfilled------------------------------
    [updateLesson.fulfilled as any]: (state) => {
      state.updating = false;
      state.editLessonModel = false;
    },
    //*rejected------------------------------
    [updateLesson.rejected as any]: (state, action) => {
      state.updatingError = JSON.parse(action.payload);
      state.updating = false;
    },
    //?------------------------------DELETE LESSON------------------
    [deleteLesson.pending as any]: (state) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteLesson.fulfilled as any]: (state) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteLesson.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
    //?------------------------------HIDE LESSON------------------
    [changeLessonDisplayStatus.pending as any]: (state) => {
      state.updating = true;
    },
    //*fulfilled------------------------------
    [changeLessonDisplayStatus.fulfilled as any]: (state) => {
      state.updating = false;
    },
    //*rejected------------------------------
    [changeLessonDisplayStatus.rejected as any]: (state, action) => {
      state.updating = false;
      state.updatingError = JSON.parse(action.payload);
    },
  },
});
export const {
  openLessonModel,
  closeLessonModel,
  closeEditLessonModel,
  openEditLessonModel,
} = lessonSlice.actions;

export default lessonSlice.reducer;
