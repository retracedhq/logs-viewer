import actions from "./actions";

const initialState = {
  apiTokens: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.RECEIVE_EITAPI_TOKENS: {
      const result = {
        ...state,
        apiTokens: action.payload.tokens,
      };
      return result;
    }
    default:
      return state;
  }
};
