import { createAction } from "redux-actions";

const actions = {
  RECEIVE_SAVED_EXPORTS: "RECEIVE_SAVED_EXPORTS",
};
export default actions;

export const receiveSavedExports = createAction(actions.RECEIVE_SAVED_EXPORTS, (queries) => ({ queries }));
