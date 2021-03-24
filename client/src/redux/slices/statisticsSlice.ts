//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRD PARTY
import axios from "axios";
//TYPES
import { Statistics } from "../types";

export const getStatistics = createAsyncThunk(
  "statistics/getStatistics",
  async (_) => {
    const res: any = await axios.get("http://localhost:5000/api/states/");
    console.log(res)
    return res.data;
  }
);

//INITIAL STATE
const statisticsInitialState: Statistics = {
  loading: false,
  counts: {},
  error: false,
};
//REDUCER
const coursesSlice = createSlice({
  name: "statistics",
  initialState: statisticsInitialState,
  reducers: {},
  extraReducers: {
    // Get subsCount
    [getStatistics.pending as any]: (state, _action) => {
      state.loading = true;
      state.error = false;
    },
    [getStatistics.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.counts = payload;
      state.error = false;
    },
    [getStatistics.rejected as any]: (state, _action) => {
      state.loading = false;
      state.error = true;
    },
  },
});
export default coursesSlice.reducer;
