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
  const middleware = [thunk];
  let enhancers = [applyMiddleware(...middleware)];

  // Add Redux DevTools extension only if running in a browser environment
  if (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }

  return createStore(rootReducer, compose(...enhancers));
}
