import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Lessons } from "../types";

const lessonsInitialState: Lessons = {
  status: true,
  list: [],
};

export const getLessons = createAsyncThunk(
  "lessons/getPostsAction",
  async () => {
    const res: any = await axios.get("http://localhost:5000/api/posts/");
    return res.data;
  }
);

export const getLessonsLimited = createAsyncThunk(
  "lessons/getLessonsLimited",
  async () => {
    const res: any = await axios.get("http://localhost:5000/api/posts/limit/7");
    return res.data;
  }
);
const lessonsSlice = createSlice({
  name: "lessons",
  initialState: lessonsInitialState,
  reducers: {},
  extraReducers: {
    // GET All LESSONS
    [getLessons.pending as any]: (state, _action) => {
      state.status = true;
    },
    [getLessons.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
    },
    [getLessons.rejected as any]: (state, _action) => {
      state.status = false;
    },
    //  GET LIMITED LESSONS
    [getLessonsLimited.pending as any]: (state, _action) => {
      state.status = true;
    },
    [getLessonsLimited.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
    },
    [getLessonsLimited.rejected as any]: (state, _action) => {
      state.status = false;
    },
  },
});
export default lessonsSlice.reducer;
