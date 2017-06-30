import { combineReducers } from "redux";
import { modalData, loadingData, filterData } from "./reducer";
import eventsUiData from "./events/reducer";

export default combineReducers({
  modalData,
  loadingData,
  filterData,
  eventsUiData,
});
