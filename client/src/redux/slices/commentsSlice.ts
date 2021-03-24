import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Comments } from "../types";

const commentsInitialState: Comments = {
  status: true,
  list: [],
};

export const getPostCommentsAction = createAsyncThunk(
  "comments/getPostCommentsAction",
  async ({ identifier, slug }: { identifier: string; slug: string }) => {
    const res: any = await axios.get(
      `http://localhost:5000/api/posts/${identifier}/${slug}/comments`
    );
    return res.data;
  }
);
export const getCommentsActions = createAsyncThunk(
  "comments/getCommentsActions",
  async () => {
    const res: any = await axios.get(
      `http://localhost:5000/api/posts/comments`
    );
    return res.data;
  }
);
const commentsSlice = createSlice({
  name: "comments",
  initialState: commentsInitialState,
  reducers: {},
  extraReducers: {
    // Get All comments
    [getCommentsActions.pending as any]: (state, _action) => {
      state.status = true;
    },
    [getCommentsActions.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
    },
    [getCommentsActions.rejected as any]: (state, _action) => {
      state.status = true;
    },

    // Get Post comments

    [getPostCommentsAction.pending as any]: (state, _action) => {
      state.status = true;
    },
    [getPostCommentsAction.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
    },
    [getPostCommentsAction.rejected as any]: (state, _action) => {
      state.status = true;
    },
  },
});
export default commentsSlice.reducer;
