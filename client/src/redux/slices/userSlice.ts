import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { User } from "../types";
import { getUsersAction } from "./usersSlice";

export const getSingleUserAction = createAsyncThunk(
  "user/getSingleUserAction",
  async ({ id }: { id: string }) => {
    const res = await axios.get(`http://localhost:5000/api/users/${id}`);
    return res.data;
  }
);

//!Add user
export const addUserAction = createAsyncThunk(
  "user/addUserAction",
  async (
    {
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      username,
      email,
      password,
    };
    try {
      const res = await axios.post(`http://localhost:5000/api/users`, data, {
        withCredentials: true,
      });

      toast.success("User added succefully.");
      dispatch(getUsersAction());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured.");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!Edit user
export const editUserAction = createAsyncThunk(
  "user/editUserAction",
  async (
    {
      username,
      email,
      role,
      id,
    }: {
      username: string;
      email: string;
      role: string;
      id: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      username,
      email,
      role,
    };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${id}`,
        data,
        {
          withCredentials: true,
        }
      );

      toast.error("User updated succefully.");

      dispatch(getUsersAction());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured.");

      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

export const deleteUserAction = createAsyncThunk(
  "user/deleteUserAction",
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/users/${id}`);
      dispatch(getUsersAction());
      toast.success("User deleted succefully.");
      return res.data;
    } catch (error) {
      toast.error("A problem has occured.");

      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

export const suspendUser = createAsyncThunk(
  "user/suspendUser",
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/suspend/${id}`,
        null,
        { withCredentials: true }
      );
      dispatch(getUsersAction());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured.");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const activateUserEmail = createAsyncThunk(
  "user/activateUserEmail",
  async ({ id }: { id: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/auth/activateUserEmail/${id}`,
        null,
        { withCredentials: true }
      );
      dispatch(getUsersAction());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured.");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
const user: User = {
  user: null, // user object
  loading: true, // loading user
  deleting: false, // loading delete user
  deletingError: {}, // delete user errors
  updating: false, // loading update user
  updatingError: {}, // update user errors
  posting: false, // adding user loading
  postingError: {}, // adding user errors
  userModel: false, // add user model
  editUserModel: false, // update user model
  editUserModelId: null,
};
//RTK
const userSlice = createSlice({
  name: "user",
  initialState: user,
  reducers: {
    openUserModel(state) {
      state.userModel = true;
    },
    closeUserModel(state) {
      state.userModel = false;
    },
    openEditUserModel(state, { payload }) {
      state.editUserModel = true;
      state.editUserModelId = payload.id;
    },
    closeEditUserModel(state) {
      state.editUserModel = false;
      state.editUserModelId = null;
    },
  },
  extraReducers: {
    //?------------------------------GET User------------------
    //*pending------------------------------
    [getSingleUserAction.pending as any]: (state, _action) => {
      state.loading = true;
    },
    //*fulfilled------------------------------
    [getSingleUserAction.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.user = payload;
    },
    //*rejected------------------------------
    [getSingleUserAction.rejected as any]: (state, _action) => {
      state.loading = false;
    },
    //?------------------------------Add User------------------
    //*pending------------------------------
    [addUserAction.pending as any]: (state, _action) => {
      state.postingError = {};
      state.posting = true;
    },
    //*fulfilled------------------------------
    [addUserAction.fulfilled as any]: (state) => {
      state.posting = false;
      state.userModel = false;
    },
    //*rejected------------------------------
    [addUserAction.rejected as any]: (state, action) => {
      state.postingError = JSON.parse(action.payload);
      state.posting = false;
    },
    //?------------------------------Edit User------------------
    //*pending------------------------------
    [editUserAction.pending as any]: (state, _action) => {
      state.updatingError = {};
      state.updating = true;
    },
    //*fulfilled------------------------------
    [editUserAction.fulfilled as any]: (state) => {
      state.updating = false;
      state.editUserModel = false;
    },
    //*rejected------------------------------
    [editUserAction.rejected as any]: (state, action) => {
      state.updatingError = JSON.parse(action.payload);
      state.updating = false;
    },
    //?------------------------------DELETE User------------------
    [deleteUserAction.pending as any]: (state, _action) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteUserAction.fulfilled as any]: (state) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteUserAction.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
    //?------------------------------Suspend User------------------
    [suspendUser.pending as any]: (state, _action) => {
      state.updating = true;
    },
    //*fulfilled------------------------------
    [suspendUser.fulfilled as any]: (state) => {
      state.updating = false;
    },
    //*rejected------------------------------
    [suspendUser.rejected as any]: (state, action) => {
      state.updating = false;
      state.updatingError = JSON.parse(action.payload);
    },
    //?------------------------------Activate User Email------------------
    [activateUserEmail.pending as any]: (state, _action) => {
      state.updating = true;
    },
    //*fulfilled------------------------------
    [activateUserEmail.fulfilled as any]: (state) => {
      state.updating = false;
    },
    //*rejected------------------------------
    [activateUserEmail.rejected as any]: (state, action) => {
      state.updating = false;
      state.updatingError = JSON.parse(action.payload);
    },
  },
});
export const {
  openUserModel,
  closeUserModel,
  closeEditUserModel,
  openEditUserModel,
} = userSlice.actions;
export default userSlice.reducer;
