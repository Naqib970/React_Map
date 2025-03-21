import { configureStore } from "@reduxjs/toolkit";
import { searchReducer } from "./slices/searchSlice";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./epics/searchEpic";

const epicMiddleware = createEpicMiddleware();
const store = configureStore({
  reducer: { search: searchReducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);
export { store };