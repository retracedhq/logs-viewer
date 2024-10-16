export const constants = {
  STORE_CURSOR: "STORE_CURSOR",
};

export function storeCursor(cursor) {
  return {
    type: constants.STORE_CURSOR,
    payload: {
      cursor,
    },
  };
}
