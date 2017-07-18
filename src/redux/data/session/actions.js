import { createAction } from "redux-actions";

const actions = {
  RECEIVE_SESSION_INFO: "RECEIVE_SESSION_INFO",
};
export default actions;

export const receiveSessionId = createAction(actions.RECEIVE_SESSION_INFO,
  (session, host) => ({ session, host }));
