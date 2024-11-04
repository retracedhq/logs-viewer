export const constants = {
  STORE_CURSOR: "STORE_CURSOR",
  STORE_SEARCH_TEXT: "STORE_SEARCH_TEXT",
};

export function storeCursor(cursor) {
  return {
    type: constants.STORE_CURSOR,
    payload: {
      cursor,
    },
  };
}

export function storeSearchText(searchText) {
  return {
    type: constants.STORE_SEARCH_TEXT,
    payload: {
      searchText,
    },
  };
}
