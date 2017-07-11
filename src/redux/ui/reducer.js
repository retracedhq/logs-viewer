import * as moment from "moment";
import { constants } from "./actions";

const modalState = {};

export function modalData(state = modalState, action = {}) {
  switch (action.type) {
    default:
      return state;
  }
}

const loadingState = {
  eventFetchLoading: false,
  exportCSVLoading: false,
};

export function loadingData(state = loadingState, action = {}) {
  switch (action.type) {
    case constants.LOADING_DATA:
      return Object.assign({}, state, {
        ...state,
        [`${action.payload.key}Loading`]: action.payload.isLoading,
      });
    default:
      return state;
  }
}

const filterState = {
  timerange: {
    start: moment().startOf("day").valueOf(),
    end: moment().endOf("day").valueOf(),
  },
  crud: "cud",
};

export function filterData(state = filterState, action = {}) {
  switch (action.type) {
    case constants.TIME_FILTER:
      return Object.assign({}, state, {
        timerange: action.payload.timerange,
      });
    case constants.CRUD_FILTER:
      return Object.assign({}, state, {
        crud: action.payload.crud,
      });
    default:
      return state;
  }
}
