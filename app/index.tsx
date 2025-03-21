import React from "react";
import { Provider } from "react-redux";
import { store } from "../src/store";
import { SearchScreen } from "../src/screens/SearchScreen";

export default function Index() {
  return (
    <Provider store={store}>
      <SearchScreen />
    </Provider>
  );
}
