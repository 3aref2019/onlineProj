import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { Sub } from "../types";
import { getSubsAction } from "./subsSlice";

export const getSingleSubAction = createAsyncThunk(
  "sub/getSingleSubAction",
  async ({ slug }: { slug: string }, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subs/${slug}`);
      return res.data;
    } catch (error) {
      if (error.response.statusText === "Not Found") {
        return rejectWithValue("not found");
      } else {
        return rejectWithValue("server error");
      }
    }
  }
);

//!Add SUBCOURSE  
export const addSubAction = createAsyncThunk(
  "sub/addSubAction",
  async (
    {
      title,
      description,
      courseSlug,
    }: {
      title: string;
      description: string;
      courseSlug: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      title,
      description,
      courseSlug,
    };
    try {
      const res = await axios.post(`http://localhost:5000/api/subs/`, data, {
        withCredentials: true,
      });
      toast.success("Section added succefully.");
      dispatch(getSubsAction());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!Edit sub
export const editSubAction = createAsyncThunk(
  "sub/editSubAction",
  async (
    {
      title,
      description,
      slug,
    }: {
      title: string;
      description: string;
      slug: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      title,
      description,
    };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/subs/${slug}`,
        data,
        {
          withCredentials: true,
        }
      );

      toast.success("Section edited succefully.");

      dispatch(getSubsAction());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");

      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

export const deleteSubAction = createAsyncThunk(
  "sub/deleteSubAction",
  async ({ slug }: { slug: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/subs/${slug}`);
      dispatch(getSubsAction());
      toast.success("Section deleted succefully.");

      return res.data;
    } catch (error) {
      toast.error("A problem has occured");

      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
const sub: Sub = {
  sub: null, // sub object
  loading: true, // loading sub
  deleting: false, // loading delete sub
  deletingError: {}, // delete sub errors
  updating: false, // loading update sub
  updatingError: {}, // update sub errors
  posting: false, // adding sub loading
  postingError: {}, // adding sub errors
  subModel: false, // add sub model
  editSubModel: false, // update sub model
  editSubModelId: null,
  shownLessons: 0,
  notFound: false,
  loadingError: false,
};
//RTK
const subSlice = createSlice({
  name: "sub",
  initialState: sub,
  reducers: {
    openSubModel(state) {
      state.subModel = true;
    },
    closeSubModel(state) {
      state.subModel = false;
    },
    openEditSubModel(state, { payload }) {
      state.editSubModel = true;
      state.editSubModelId = payload.id;
    },
    closeEditSubModel(state) {
      state.editSubModel = false;
      state.editSubModelId = null;
    },
  },
  extraReducers: {
    //?------------------------------GET SUBCOURSE------------------
    //*pending------------------------------
    [getSingleSubAction.pending as any]: (state, _action) => {
      state.loading = true;
      state.notFound = false;
      state.loadingError = false;
    },
    //*fulfilled------------------------------
    [getSingleSubAction.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.sub = payload;
      let count = 0;
      state.sub.lessons.forEach((element) => {
        if (element.displayStatus) count++;
      });
      state.shownLessons = count;
    },
    //*rejected------------------------------
    [getSingleSubAction.rejected as any]: (state, { payload }) => {
      state.loading = false;
      if (payload === "not found") {
        state.notFound = true;
      } else {
        state.loadingError = true;
      }
    },
    //?------------------------------CREATE SUBCOURSE ------------------
    //*pending------------------------------
    [addSubAction.pending as any]: (state, _action) => {
      state.postingError = {};
      state.posting = true;
    },
    //*fulfilled------------------------------
    [addSubAction.fulfilled as any]: (state, _action) => {
      state.posting = false;
      state.subModel = false;
    },
    //*rejected------------------------------
    [addSubAction.rejected as any]: (state, action) => {
      state.postingError = JSON.parse(action.payload);
      state.posting = false;
    },
    //?------------------------------UPDATE SUBCOURSE------------------
    //*pending------------------------------
    [editSubAction.pending as any]: (state, _action) => {
      state.updatingError = {};
      state.updating = true;
    },
    //*fulfilled------------------------------
    [editSubAction.fulfilled as any]: (state, _action) => {
      state.updating = false;
      state.editSubModel = false;
    },
    //*rejected------------------------------
    [editSubAction.rejected as any]: (state, action) => {
      state.updatingError = JSON.parse(action.payload);
      state.updating = false;
    },
    //?------------------------------DELETE SUBCOURSE------------------
    [deleteSubAction.pending as any]: (state, _action) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteSubAction.fulfilled as any]: (state, _action) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteSubAction.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
  },
});
export const {
  closeEditSubModel,
  closeSubModel,
  openEditSubModel,
  openSubModel,
} = subSlice.actions;

export default subSlice.reducer;
