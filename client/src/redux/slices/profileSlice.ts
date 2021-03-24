//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//Utils
import axios from "axios";
import { toast } from "react-toastify";
//Types
import { Profile } from "../types";
import { getUserOnLoadThunk } from "./authSlice";

const profileInitialState: Profile = {
  emailModal: false,
  passwordModal: false,
  updating: false,
  oldEmail: "",
  newEmail: "",
  errors: {},
  oldPassword: "",
  newPassword: "",
  bio: "",
  bioModal: false,
};

export const updateEmail = createAsyncThunk(
  "profile/updateEmail",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const { profile } = getState() as { profile: Profile };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/updateEmail`,
        { oldEmail: profile.oldEmail, newEmail: profile.newEmail },
        { withCredentials: true }
      );
      toast.success("Your email has been updated");
      dispatch(getUserOnLoadThunk());
      return res.data;
    } catch (error) {
      toast.warn("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const updatePassword = createAsyncThunk(
  "profile/updatePassword",
  async (_, { rejectWithValue, getState }) => {
    const { profile } = getState() as { profile: Profile };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/updatePassword`,
        { oldPassword: profile.oldPassword, newPassword: profile.newPassword },
        { withCredentials: true }
      );

      toast.success("Your password has been updated");
      return res.data;
    } catch (error) {
      toast.warn("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
export const updateBio = createAsyncThunk(
  "profile/updateBio",
  async (_, { rejectWithValue, getState, dispatch }) => {
    const {
      profile: { bio },
    } = getState() as { profile: Profile };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/updateBio`,
        { bio },
        { withCredentials: true }
      );

      toast.success("Your infos has been updated");
      dispatch(getUserOnLoadThunk());
      return res.data;
    } catch (error) {
      toast.warn("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
const profileSlice = createSlice({
  name: "profile",
  initialState: profileInitialState,
  reducers: {
    // email modal
    handleOldEmailChange: (state, action) => {
      state.oldEmail = action.payload;
    },
    handleNewEmailChange: (state, action) => {
      state.newEmail = action.payload;
    },
    handleUpdateEmailModalOpen: (state) => {
      state.emailModal = true;
    },
    handleUpdateEmailModalClose: (state) => {
      state.oldEmail = "";
      state.newEmail = "";
      state.emailModal = false;
      state.errors = {};
    },
    // password modal
    handleOldPasswordChange: (state, { payload }) => {
      state.oldPassword = payload;
    },
    handleNewPasswordChange: (state, { payload }) => {
      state.newPassword = payload;
    },
    handleUpdatePasswordModalOpen: (state) => {
      state.passwordModal = true;
    },
    handleUpdatePasswordModalClose: (state) => {
      state.oldPassword = "";
      state.newPassword = "";
      state.passwordModal = false;
      state.errors = {};
    },
    // Bio modal
    handleBio: (state, { payload }) => {
      state.bio = payload;
    },
    handleBioModalOpen: (state) => {
      state.bioModal = true;
    },
    handleBioModalClose: (state) => {
      state.bioModal = false;
      state.bio = "";
    },
  },
  extraReducers: {
    [updateEmail.pending as any]: (state, _action) => {
      state.updating = true;
      state.errors = {};
    },
    [updateEmail.fulfilled as any]: (state,  ) => {
      state.updating = false;
      state.oldEmail = "";
      state.newEmail = "";
      state.emailModal = false;
    },
    [updateEmail.rejected as any]: (state, action) => {
      state.updating = false;
      state.errors = JSON.parse(action.payload);
    },
    ////////////////////////////////////////////////////
    [updatePassword.pending as any]: (state, _action) => {
      state.updating = true;
      state.errors = {};
    },
    [updatePassword.fulfilled as any]: (state,  ) => {
      state.updating = false;
      state.oldPassword = "";
      state.newPassword = "";
      state.passwordModal = false;
    },
    [updatePassword.rejected as any]: (state, action) => {
      state.updating = false;
      state.errors = JSON.parse(action.payload);
    },
    ////////////////////////////////////////////////////
    [updateBio.pending as any]: (state) => {
      state.updating = true;
      state.errors = {};
    },
    [updateBio.fulfilled as any]: (state) => {
      state.updating = false;
      state.bio = "";
      state.bioModal = false;
    },
    [updateBio.rejected as any]: (state) => {
      state.updating = false;
    },
  },
});
export const {
  handleNewEmailChange,
  handleOldEmailChange,
  handleUpdateEmailModalClose,
  handleUpdateEmailModalOpen,
  handleNewPasswordChange,
  handleOldPasswordChange,
  handleUpdatePasswordModalClose,
  handleUpdatePasswordModalOpen,
  handleBio,
  handleBioModalClose,
  handleBioModalOpen,
} = profileSlice.actions;
export default profileSlice.reducer;
