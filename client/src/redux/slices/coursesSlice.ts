//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRD PARTY
import axios from "axios";
//TYPES
import { Courses } from "../types";



export const getCourses = createAsyncThunk(
  "courses/getCourses",
  async (_) => {
    const res: any = await axios.get(
      "http://localhost:5000/api/subs/course/all"
    );
    return res.data;
  }
);
export const getLatestCourses = createAsyncThunk(
  "courses/getLatestCourses",
  async (_) => {
    const res: any = await axios.get(
      "http://localhost:5000/api/subs/course/latest"
    );
    return res.data;
  }
);
//INITIAL STATE
const coursesInitialState: Courses = {
  status: true,
  list: [],
  listLimited: [],
  error: false,
};
//REDUCER
const coursesSlice = createSlice({
  name: "courses",
  initialState: coursesInitialState,
  reducers: {},
  extraReducers: {
    // Get All posts
    [getCourses.pending as any]: (state, _action) => {
      state.status = true;
      state.error = false;
    },
    [getCourses.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
      state.error = false;
    },
    [getCourses.rejected as any]: (state, _action) => {
      state.status = false;
      state.error = true;
    },
    //Get Latest courses
    [getLatestCourses.pending as any]: (state, _action) => {
      state.status = true;
      state.error = false;
    },
    [getLatestCourses.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.listLimited = payload;
      state.error = false;
    },
    [getLatestCourses.rejected as any]: (state, _action) => {
      state.status = false;
      state.error = true;
    },
  },
});
export default coursesSlice.reducer;
