import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    token: null,
    code: null,
    full_name: null,
    user_id:null,
  },
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
    },
    updateCode: (state, action) => {
      state.code = action.payload;
    },
    updateName: (state, action) => {
      state.full_name = action.payload;
    },
    updateUserID: (state, action) => {
      state.user_id = action.payload;
    },
    toggleLogin: (state, action) => {
      // state.isLoggedIn = state.token !== null ? true : false;
      state.isLoggedIn = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
