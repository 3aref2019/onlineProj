//RTK
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//THIRDPARTY
import axios from "axios";
import { toast } from "react-toastify";
//TYPES
import { Book } from "../types";
//ACTIONS
import { getBooks } from "./booksSlice";

//!Get Book
export const getBook = createAsyncThunk(
  "book/getBook",
  async ({ slug }: { slug: string }) => {
    const res = await axios.get(`http://localhost:5000/api/books/${slug}`);
    return res.data;
  }
);

//!Create Book
export const createBook = createAsyncThunk(
  "book/createBook",
  async (
    {
      title,
      link,
      description,
      picture,
    }: {
      title: string;
      link:string
      description: string;
      picture: File | null;
    },
    { rejectWithValue, dispatch }
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("link", link);
    if (picture) formData.append("picture", picture);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/books/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Book added succefully");
      dispatch(getBooks());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!Update Book
export const updateBook = createAsyncThunk(
  "book/updateBook",
  async (
    {
      title,
      description,
      slug,
      link,
    }: {
      title: string;
      description: string;
      slug: string;
      link:string
    },
    { rejectWithValue, dispatch }
  ) => {
    const data = {
      title,
      description,
      link
    };
    try {
      const res = await axios.put(
        `http://localhost:5000/api/books/${slug}`,
        data,
        {
          withCredentials: true,
        }
      );
      toast.success("Book edited succefully.");
      dispatch(getBooks());
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);

//!Delete book
export const deleteBook = createAsyncThunk(
  "book/deleteBook",
  async ({ slug }: { slug: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/books/${slug}`);
      dispatch(getBooks());
      toast.success("Book deleted succefully.");
      return res.data;
    } catch (error) {
      toast.error("A problem has occured");
      return rejectWithValue(JSON.stringify(error.response.data));
    }
  }
);
//Initial State
const bookInitialState: Book = {
  book: null, // Book
  loading: true, // loading Book
  deleting: false, // loading delete Book
  deletingError: {}, // delete Book errors
  updating: false, // loading update Book
  updatingError: {}, // update Book errors
  posting: false, // adding Book loading
  postingError: {}, // adding Book errors
  bookModel: false, // add Book model
  editBookModel: false, // update Book model
  editBookModelId: null, // BookModelId
};

//Reducer
const bookSlice = createSlice({
  name: "book",
  initialState: bookInitialState,
  reducers: {
    openBookModel(state) {
      state.bookModel = true;
    },
    closeBookModel(state) {
      state.bookModel = false;
    },
    openEditBookModel(state, { payload }) {
      state.editBookModel = true;
      state.editBookModelId = payload.slug;
    },
    closeEditBookModel(state) {
      state.editBookModel = false;
      state.editBookModelId = null;
    },
  },
  extraReducers: {
    //?------------------------------GET BOOK------------------
    //*pending------------------------------
    [getBook.pending as any]: (state) => {
      state.loading = true;
    },
    //*fulfilled------------------------------
    [getBook.fulfilled as any]: (state, { payload }) => {
      state.loading = false;
      state.book = payload;
    },
    //*rejected------------------------------
    [getBook.rejected as any]: (state) => {
      state.loading = false;
    },
    //?------------------------------CREATE BOOK------------------
    //*pending------------------------------
    [createBook.pending as any]: (state) => {
      state.postingError = {};
      state.posting = true;
    },
    //*fulfilled------------------------------
    [createBook.fulfilled as any]: (state) => {
      state.posting = false;
      state.bookModel = false;
    },
    //*rejected------------------------------
    [createBook.rejected as any]: (state, action) => {
      state.postingError = JSON.parse(action.payload);
      state.posting = false;
    },
    //?------------------------------UPDATE BOOK------------------
    //*pending------------------------------
    [updateBook.pending as any]: (state) => {
      state.updatingError = {};
      state.updating = true;
    },
    //*fulfilled------------------------------
    [updateBook.fulfilled as any]: (state) => {
      state.updating = false;
      state.editBookModel = false;
    },
    //*rejected------------------------------
    [updateBook.rejected as any]: (state, action) => {
      state.updatingError = JSON.parse(action.payload);
      state.updating = false;
    },
    //?------------------------------DELETE BOOK------------------
    [deleteBook.pending as any]: (state) => {
      state.deleting = true;
    },
    //*fulfilled------------------------------
    [deleteBook.fulfilled as any]: (state) => {
      state.deleting = false;
    },
    //*rejected------------------------------
    [deleteBook.rejected as any]: (state, action) => {
      state.deleting = false;
      state.deletingError = JSON.parse(action.payload);
    },
  },
});
export const {
  closeBookModel,closeEditBookModel,openBookModel,openEditBookModel
} = bookSlice.actions;
export default bookSlice.reducer;
