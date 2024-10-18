import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { avatar: "" },
  reducers: {
    toggle(_state) {
      // state.cartIsVisible = !state.cartIsVisible;
    },
    setUserIcon(state, action) {
      state.avatar = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
