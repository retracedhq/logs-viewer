import actions from "./actions";

const initialState = {
  savedSearchQueries: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.RECEIVE_SAVED_EXPORTS: {
      const result = {
        ...state,
        savedSearchQueries: action.payload.queries,
      };
      return result;
    }
    default:
      return state;
  }
};
