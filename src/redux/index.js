import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import data from "./data";
import ui from "./ui";
//import session from "./session";

const rootReducer = combineReducers({
  data,
  ui,
});

// Global store instance
let globalStore;
export function createStore() {
  if (globalStore) { return };
  const hasExtension = window.devToolsExtension;

  globalStore = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunk),
      hasExtension ? window.devToolsExtension() : f => f,
    ),
  );
  
  return globalStore;
}

export function getStore() {
  return globalStore;
}
