import * as _ from "lodash";
import actions from "./actions";

const initialState = {
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
    default:
      return state;
  }
};
