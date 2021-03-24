//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRD PARTY
import axios from "axios";
//TYPES
import { Articles } from "../types";

export const getArticles = createAsyncThunk(
  "articles/getArticles",
  async () => {
    try {
      const res: any = await axios.get("http://localhost:5000/api/article/");
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);
export const getArticlesPaginated = createAsyncThunk(
  "articles/getArticlesPaginated",
  async ({ current }: { current: number }) => {
    const res: any = await axios.get(
      `http://localhost:5000/api/article/paginate/?current=${current}`
    );
    return res.data;
  }
);

//InitialState
const articlesInitialState: Articles = {
  status: true,
  list: [],
  error: false,
  listPaginated: [],
  infos: {},
};
//Reducer
const articlesSlice = createSlice({
  name: "articles",
  initialState: articlesInitialState,
  reducers: {},
  extraReducers: {
    // Get All posts
    [getArticles.pending as any]: (state, _action) => {
      state.status = true;
      state.error = false;
    },
    [getArticles.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
      state.error = false;
    },
    [getArticles.rejected as any]: (state, _action) => {
      state.status = false;
      state.error = true;
    },
    // Get All posts
    [getArticlesPaginated.pending as any]: (state, _action) => {
      state.status = true;
      state.error = false;
    },
    [getArticlesPaginated.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.listPaginated = payload.articles;
      state.error = false;
      state.infos = payload.infos;
    },
    [getArticlesPaginated.rejected as any]: (state, _action) => {
      state.status = false;
      state.error = true;
    },
  },
});
export default articlesSlice.reducer;
