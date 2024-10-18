import { configureStore } from "@reduxjs/toolkit";

import uiSlice from "./ui-slice";

export const store = configureStore({
  reducer: {
    ui: uiSlice,
  },
});
