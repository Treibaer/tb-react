import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { avatar: "", party: false },
  reducers: {
    toggle(_state) {
      // state.cartIsVisible = !state.cartIsVisible;
    },
    startParty(state) {
      state.party = true;
    },
    stopParty(state) {
      state.party = false;
    },
    setUserIcon(state, action) {
      state.avatar = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
