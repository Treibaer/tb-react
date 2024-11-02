import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UIState = {
  avatar: string;
  party: boolean;
};

const initialState: UIState = {
  avatar: "",
  party: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
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
    setUserIcon(state, action: PayloadAction<string>) {
      state.avatar = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export const { toggle, startParty, stopParty, setUserIcon } = uiSlice.actions;

export default uiSlice.reducer;
