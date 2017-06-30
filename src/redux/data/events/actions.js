import { createAction } from "redux-actions";

const actions = {
  RECEIVE_EVENT_LIST: "RECEIVE_EVENT_LIST",
};
export default actions;

export const receiveEventList = createAction(actions.RECEIVE_EVENT_LIST,
  (sourceQuery, totalHitCount, list, cursor) =>
    ({ sourceQuery, totalHitCount, list, cursor }));
