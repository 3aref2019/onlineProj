import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Users } from "../types";

const usersInitialState: Users = {
  status: true,
  list: [],
};

export const getUsersAction = createAsyncThunk(
  "users/getUsersAction",
  async () => {
    const res: any = await axios.get("http://localhost:5000/api/users");
    return res.data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: usersInitialState,
  reducers: {},
  extraReducers: {
    // Get All posts
    [getUsersAction.pending as any]: (state, _action) => {
      state.status = true;
    },
    [getUsersAction.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
    },
    [getUsersAction.rejected as any]: (state, _action) => {
      state.status = false;
    },
  },
});
export default usersSlice.reducer;
