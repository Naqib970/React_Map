import { createSlice } from "@reduxjs/toolkit";

interface SearchState {
  results: any[];
  history: string[];
}

const initialState: SearchState = {
  results: [],
  history: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setResults: (state, action) => {
      state.results = action.payload;
    },
    addSearchToHistory: (state, action) => {
      if (!state.history.includes(action.payload)) {
        state.history.unshift(action.payload);
      }
    },
  },
});

export const { setResults, addSearchToHistory } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;