import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Comment } from "../types";
import { getPostCommentsAction } from "./commentsSlice";
import { toast } from "react-toastify";

export const getSingleCommentAction = createAsyncThunk(
  "comment/getSingleCommentAction",
  async ({ identifier }: { identifier: string }) => {
    const res = await axios.get(
      `http://localhost:5000/api/posts/comment/${identifier}`
    );
    return res.data;
  }
);

//!User add comment
export const addCommentAction = createAsyncThunk(
  "comment/addComment",
  async (
    {
      identifier,
      slug,
      body,
      picture,
    }: {
      identifier: string;
      slug: string;
      body: string;
      picture: File | null;
    },
    { rejectWithValue, dispatch }
  ) => {
    const formData = new FormData();
    formData.append("body", body);
    if (picture) formData.append("picture", picture);

    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${identifier}/${slug}/comment`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success("Comment added succefully");
      dispatch(resetCommentField());
      dispatch(getPostCommentsAction({ identifier, slug }));
      return res.data;
    } catch (error) {
      toast.success("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const deleteCommentAction = createAsyncThunk(
  "comment/deleteCommentAction",
  async (
    { id, identifier, slug }: { id: string; identifier: string; slug: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/posts/comment/${id}`
      );
      dispatch(getPostCommentsAction({ identifier, slug }));
      // dispatch(getPostCommentsAction({ identifier, slug }));
      toast.success("Comment deleted succefully");
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const deleteCommentActionAdmin = createAsyncThunk(
  "comment/deleteCommentAction",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/posts/comment/${id}`
      );
      // dispatch(getPostCommentsAction({ identifier, slug }));
      toast.success("Comment added succefully");
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
const comment: Comment = {
  comment: null, // comment object
  loading: true, // loading comment
  deleting: false, // loading delete comment
  deletingError: {}, // delete comment errors
  commenting: false, // adding comment loading
  commentingError: {}, // adding comment errors
  commentModel: false, // add comment model
  editCommentModel: false, // update comment model
  editCommentModelId: null,
  commentBody: "",
};
//RTK
const commentSlice = createSlice({
  name: "comment",
  initialState: comment,
  reducers: {
    setCommentBody(state, { payload }) {
      state.commentBody = payload;
    },
    resetCommentField(state) {
      state.commentBody = "";
    },
    openCommentModel(state) {
      state.commentModel = true;
    },
    closeCommentModel(state) {
      state.commentModel = false;
    },
    openEditCommentModel(state, { payload }) {
      state.editCommentModel = true;
      state.editCommentModelId = payload.id;
    },
    closeEditCommentModel(state) {
      state.editCommentModel = false;
      state.editCommentModelId = null;
    },
  },
  extraReducers: {
    //?------------------------------GET SINGLE COMMENT------------------
    //*pending------------------------------
    [getSingleCommentAction.pending as any]: (state, _action) => {
      state.loading = true;
    },
    //*fulfilled------------------------------
    [getSingleCommentAction.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.comment = payload;
    },
    //*rejected------------------------------
    [getSingleCommentAction.rejected as any]: (state, _action) => {
      state.loading = false;
    },
    //?------------------------------Add COMMENT------------------
    //*pending------------------------------
    [addCommentAction.pending as any]: (state, _action) => {
      state.commentingError = {};
      state.commenting = true;
    },
    //*fulfilled------------------------------
    [addCommentAction.fulfilled as any]: (state) => {
      state.commenting = false;
      state.commentModel = false;
    },
    //*rejected------------------------------
    [addCommentAction.rejected as any]: (state, action) => {
      state.commentingError = JSON.parse(action.payload);
      state.commenting = false;
    },

    //?------------------------------DELETE comment------------------
    [deleteCommentAction.pending as any]: (state, _action) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteCommentAction.fulfilled as any]: (state ) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteCommentAction.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
  },
});
export const {
  closeCommentModel,
  closeEditCommentModel,
  openCommentModel,
  openEditCommentModel,
  setCommentBody,
  resetCommentField,
} = commentSlice.actions;
export default commentSlice.reducer;
