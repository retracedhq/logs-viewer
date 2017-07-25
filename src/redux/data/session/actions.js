import { createAction } from "redux-actions";

const actions = {
  RECEIVE_SESSION_INFO: "RECEIVE_SESSION_INFO",
  CLEAR_SESSION: "CLEAR_SESSION",
};
export default actions;

export const receiveSessionId = createAction(actions.RECEIVE_SESSION_INFO,
  (session, host) => ({ session, host }));

export const clearSession = createAction(actions.CLEAR_SESSION,
() => ({ }));
  
