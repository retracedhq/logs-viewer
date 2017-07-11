import { createAction } from "redux-actions";

const actions = {
  RECEIVE_EVENT_LIST: "RECEIVE_EVENT_LIST",
  RECEIVE_SESSION_INFO: "RECEIVE_SESSION_INFO",
  RECEIVE_SAVED_EXPORTS: "RECEIVE_SAVED_EXPORTS",
};
export default actions;

export const receiveEventList = createAction(actions.RECEIVE_EVENT_LIST,
  (sourceQuery, totalHitCount, list, cursor) =>
    ({ sourceQuery, totalHitCount, list, cursor }));
export const receiveSessionId = createAction(actions.RECEIVE_SESSION_INFO,
  (session) => ({ session }));
export const receiveSavedExports = createAction(actions.RECEIVE_SAVED_EXPORTS,
  (queries) => ({ queries }));
