import _ from "lodash";
import actions from "./actions";

const initialState = {
  session: {},
  host: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.RECEIVE_SESSION_INFO: {
      const result = {
        ...state,
        session: action.payload.session,
        host: action.payload.host,
      };
      return result;
    }
    default:
      return state;
  }
};
