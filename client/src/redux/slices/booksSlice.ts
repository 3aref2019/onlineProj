//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRD PARTY
import axios from "axios";
//TYPES
import { Books } from "../types";

export const getBooks = createAsyncThunk(
  "books/getBooks",
  async () => {
    try {
      const res: any = await axios.get("http://localhost:5000/api/books/");
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);


//InitialState
const booksInitialState: Books = {
  status: true,
  list: [],
  error: false,
};
//Reducer
const booksSlice = createSlice({
  name: "books",
  initialState: booksInitialState,
  reducers: {},
  extraReducers: {
    // Get All books
    [getBooks.pending as any]: (state, _action) => {
      state.status = true;
      state.error = false;
    },
    [getBooks.fulfilled as any]: (state, { payload }) => {
      state.status = false;
      state.list = payload;
      state.error = false;
    },
    [getBooks.rejected as any]: (state, _action) => {
      state.status = false;
      state.error = true;
    },
  },
});
export default booksSlice.reducer;
