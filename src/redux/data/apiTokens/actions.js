import { createAction } from "redux-actions";

const actions = {
  RECEIVE_EITAPI_TOKENS: "RECEIVE_EITAPI_TOKENS",
};
export default actions;

export const receiveApiTokens = createAction(actions.RECEIVE_EITAPI_TOKENS, (tokens) => ({ tokens }));
