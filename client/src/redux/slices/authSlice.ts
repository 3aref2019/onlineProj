//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//Types
import { Auth } from "../types";
//Libraries
import axios from "axios";
import { toast } from "react-toastify";


//Initial State
const authInitialState: Auth = {
  user: null,
  isAuthenticated: false,
  loading: true,
  errorsRegister: {},
  errorsLogin: {},
  errorsLogout: {},
  errorsActivating: {},
  activating: true,
};

//REGISTER
export const registerActionThunk = createAsyncThunk(
  "auth/registerActionThunk",
  async (
    {
      email,
      password,
      username,
    }: { email: string; password: string; username: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );
      toast.success("Registred succefully");
      if (response.status === 200) return response.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//LOGIN
export const loginActionThunk = createAsyncThunk(
  "auth/loginActionThunk",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      toast.success("Welcome back");
      return response.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
//LOGOUT
export const logoutActionThunk = createAsyncThunk(
  "auth/logoutActionThunk",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/logout",
        { withCredentials: true }
      );
      toast.success("Go back soon");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//Load User
export const getUserOnLoadThunk = createAsyncThunk(
  "auth/getUserOnLoadThunk",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        withCredentials: true,
      });
      if (response.status === 200) return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createActivationLink = createAsyncThunk(
  "auth/createActivationLink",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/createActivationLink",
        {
          withCredentials: true,
        }
      );
      toast.success("Activation email was sent.");
      if (response.status === 200) return response.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(error.response.data);
    }
  }
);

export const verifyActivationLink = createAsyncThunk(
  "auth/verifyActivationLink",
  async ({ token }: { token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/verifyActivationLink",
        { token },
        {
          withCredentials: true,
        }
      );
      toast.success("You email has been verified");
      return response.data
    } catch (error) {

      return rejectWithValue(JSON.stringify(error.response.data.error));
    }
  }
);
//REDUCER
const authSlice = createSlice({
  name: "user",
  initialState: authInitialState,
  reducers: {
    resetErrors: (state) => {
      state.errorsLogin = {};
      state.errorsRegister = {};
      state.errorsLogout = {};
    },
  },
  extraReducers: {
    //!-----------------------LoadUser
    [getUserOnLoadThunk.pending.type]: (state) => {
      state.loading = true;
    },
    [getUserOnLoadThunk.fulfilled.type]: (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    [getUserOnLoadThunk.rejected.type]: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = false;
      state.loading = false;
    },
    //!-----------------------Login

    [loginActionThunk.pending.type]: (state) => {
      state.loading = true;
      state.errorsLogin = {};
    },
    [loginActionThunk.fulfilled.type]: (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.errorsLogin = {};
    },
    [loginActionThunk.rejected.type]: (state, action) => {
      state.user = null;
      state.errorsLogin = JSON.parse(action.payload);
      state.isAuthenticated = false;
      state.loading = false;
    },
    //!-----------------------Register

    [registerActionThunk.pending.type]: (state) => {
      state.loading = true;
      state.errorsRegister = {};
    },
    [registerActionThunk.fulfilled.type]: (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.errorsRegister = {};
    },
    [registerActionThunk.rejected.type]: (state, action) => {
      state.user = null;
      state.errorsRegister = JSON.parse(action.payload);
      state.isAuthenticated = false;
      state.loading = false;
    },
    //!-----------------------Logout
    [logoutActionThunk.pending.type]: (state) => {
      state.user = null;
      state.errorsLogout = {};
      state.isAuthenticated = false;
      state.loading = true;
    },
    [logoutActionThunk.fulfilled.type]: (state) => {
      state.user = null;
      state.errorsLogout = {};
      state.isAuthenticated = false;
      state.loading = false;
    },
    [logoutActionThunk.rejected.type]: (state) => {
      state.user = null;
      state.errorsLogout = {};
      state.isAuthenticated = false;
      state.loading = false;
    },
    //!-----------------------verifyActivationLink
    [verifyActivationLink.pending.type]: (state) => {
      state.errorsActivating = null;
      state.activating = true;
    },
    [verifyActivationLink.fulfilled.type]: (state) => {
      state.activating = false;
      state.errorsActivating = null;
    },
    [verifyActivationLink.rejected.type]: (state, { payload }) => {
      state.activating = false;
      state.errorsActivating = JSON.parse(payload);
    },
  },
});
export const { resetErrors } = authSlice.actions;

export default authSlice.reducer;
