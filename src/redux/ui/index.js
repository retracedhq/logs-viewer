import { combineReducers } from "redux";
import { loadingData } from "./reducer";
import eventsUiData from "./events/reducer";

export default combineReducers({
  loadingData,
  eventsUiData,
});
