import * as _ from "lodash";
import actions from "./actions";

const initialState = {
  byId: {},
  latestServerResults: {
    sourceQuery: {},
    totalResultCount: 0,
    resultIds: [],
    savedSearchQueries: [],
  },
  session: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.RECEIVE_SESSION_INFO: {
      const result = {
        ...state,
        session: action.payload.session,
      };
      return result;
    }
    case actions.RECEIVE_EVENT_LIST: {
      // To save on RAM, we only store the latest page received
      const result = {
        ...state,
        byId: _.keyBy(action.payload.list, "id"),
        latestServerResults: {
          ...state.latestServerResults,
          sourceQuery: action.payload.sourceQuery,
          totalResultCount: action.payload.totalHitCount,
          resultIds: action.payload.list.map(e => e.id),
          cursor: action.payload.cursor,
        },
      };
      return result;
    }
    case actions.RECEIVE_SAVED_EXPORTS: {
      const result = {
        ...state,
        latestServerResults: {
          ...state.latestServerResults,
          savedSearchQueries: action.payload.queries,
        }
      };
      return result;
    }
    default:
      return state;
  }
};
