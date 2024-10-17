import { constants } from "./actions";

const loadingState = {
  eventFetchLoading: false,
  exportCSVLoading: false,
  apiTokensLoading: false,
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
