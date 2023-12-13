import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";

import data from "./data";
import ui from "./ui";

const appReducer = combineReducers({
  data,
  ui,
});

const rootReducer = (state, action) => {
  if (action.type === "CLEAR_SESSION") {
    state = undefined;
  }

  return appReducer(state, action);
};

// Global store instance
export function configStore() {
  const hasExtension = window.devToolsExtension;

  return createStore(
    rootReducer,
    compose(applyMiddleware(thunk), hasExtension ? window.devToolsExtension() : (f) => f)
  );
}
