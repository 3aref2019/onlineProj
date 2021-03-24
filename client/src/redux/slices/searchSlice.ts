import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Search } from "../types";

const courseInitialState: Search = {
  status: true,
  results: [],
  error: false,
};
export const searchCourse = createAsyncThunk(
  "search/searchCourse",
  async ({ query }: { query: string }) => {
    const response = await axios.get(
      `http://localhost:5000/api/subs/course/search/?query=${query}`
      
    );
    return response.data;
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState: courseInitialState,
  reducers: {},
  extraReducers: {
    // Get All posts
    [searchCourse.pending as any]: (state) => {
      state.status = true;
      state.error = false;
      state.results = [];
    },
    [searchCourse.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.results = payload;
      state.error = false;
    },
    [searchCourse.rejected as any]: (state) => {
      state.status = false;
      state.error = true;
    },
  },
});
export default searchSlice.reducer;
