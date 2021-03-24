//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRDPARTY
import axios from "axios";
import { toast } from "react-toastify";
//TYPES
import { Article } from "../types";
//ACTIONS
import { getArticles } from "./articlesSlice";

//!Get Article
export const getArticle = createAsyncThunk(
  "article/getArticle",
  async ({ id }: { id: string }) => {
    const res = await axios.get(`http://localhost:5000/api/article/${id}`);
    return res.data;
  }
);

//!Create Article
export const createArticle = createAsyncThunk(
  "article/createArticle",
  async (
    {
      title,
      body,
      picture,
    }: {
      title: string;
      body: string;
      picture: File | null;
    },
    { rejectWithValue, dispatch }
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    if (picture) formData.append("picture", picture);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/article/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Article added succefully");
      dispatch(getArticles());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!Update Article
export const updateArticle = createAsyncThunk(
  "article/updateArticle",
  async (
    {
      title,
      body,
      id,
    }: {
      title: string;
      body: string;
      id: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      title,
      body,
    };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/article/${id}`,
        data,
        {
          withCredentials: true,
        }
      );
      toast.success("Article edited succefully.");
      dispatch(getArticles());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!Delete article
export const deleteArticle = createAsyncThunk(
  "article/deleteArticle",
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/article/${id}`);
      dispatch(getArticles());
      toast.success("Article deleted succefully.");
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
//Initial State
const articleInitialState: Article = {
  article: null, // Article
  loading: true, // loading Article
  deleting: false, // loading delete Article
  deletingError: {}, // delete Article errors
  updating: false, // loading update Article
  updatingError: {}, // update Article errors
  posting: false, // adding Article loading
  postingError: {}, // adding Article errors
  articleModel: false, // add Article model
  editArticleModel: false, // update Article model
  editArticleModelId: null, // ArticleModelId
};

//Reducer
const articleSlice = createSlice({
  name: "article",
  initialState: articleInitialState,
  reducers: {
    openArticleModel(state) {
      state.articleModel = true;
    },
    closeArticleModel(state) {
      state.articleModel = false;
    },
    openEditArticleModel(state, { payload }) {
      state.editArticleModel = true;
      state.editArticleModelId = payload.id;
    },
    closeEditArticleModel(state) {
      state.editArticleModel = false;
      state.editArticleModelId = null;
    },
  },
  extraReducers: {
    //?------------------------------GET ARTICLE------------------
    //*pending------------------------------
    [getArticle.pending as any]: (state) => {
      state.loading = true;
    },
    //*fulfilled------------------------------
    [getArticle.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.article = payload;
    },
    //*rejected------------------------------
    [getArticle.rejected as any]: (state) => {
      state.loading = false;
    },
    //?------------------------------CREATE ARTICLE------------------
    //*pending------------------------------
    [createArticle.pending as any]: (state) => {
      state.postingError = {};
      state.posting = true;
    },
    //*fulfilled------------------------------
    [createArticle.fulfilled as any]: (state) => {
      state.posting = false;
      state.articleModel = false;
    },
    //*rejected------------------------------
    [createArticle.rejected as any]: (state, action) => {
      state.postingError = JSON.parse(action.payload);
      state.posting = false;
    },
    //?------------------------------UPDATE ARTICLE------------------
    //*pending------------------------------
    [updateArticle.pending as any]: (state) => {
      state.updatingError = {};
      state.updating = true;
    },
    //*fulfilled------------------------------
    [updateArticle.fulfilled as any]: (state) => {
      state.updating = false;
      state.editArticleModel = false;
    },
    //*rejected------------------------------
    [updateArticle.rejected as any]: (state, action) => {
      state.updatingError = JSON.parse(action.payload);
      state.updating = false;
    },
    //?------------------------------DELETE ARTICLE------------------
    [deleteArticle.pending as any]: (state) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteArticle.fulfilled as any]: (state) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteArticle.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
  },
});
export const {
  closeArticleModel,closeEditArticleModel,openArticleModel,openEditArticleModel
} = articleSlice.actions;
export default articleSlice.reducer;
