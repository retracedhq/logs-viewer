import _ from "lodash";
import actions from "./actions";

const initialState = {
  byId: {},
  latestServerResults: {
    sourceQuery: {},
    totalResultCount: 0,
    resultIds: [],
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.RECEIVE_EVENT_LIST: {
      // To save on RAM, we only store the latest page received
      const result = {
        ...state,
        byId: _.keyBy(action.payload.list, "id"),
        latestServerResults: {
          ...state.latestServerResults,
          sourceQuery: action.payload.sourceQuery,
          totalResultCount: action.payload.totalHitCount,
          resultIds: action.payload.list.map((e) => e.id),
          cursor: action.payload.cursor,
        },
      };
      return result;
    }
    default:
      return state;
  }
};
