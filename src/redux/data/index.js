import { combineReducers } from "redux";
import eventsData from "./events/reducer";
import exportsData from "./exports/reducer";
import sessionData from "./session/reducer";

export default combineReducers({
  eventsData,
  exportsData,
  sessionData,
});
