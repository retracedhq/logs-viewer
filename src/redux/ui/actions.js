export const constants = {
  DISPLAY_MODAL: "DISPLAY_MODAL",
  LOADING_DATA: "LOADING_DATA",
  TIME_FILTER: "TIME_FILTER",
  CRUD_FILTER: "CRUD_FILTER",
};

export function displayModal(key, display) {
  return {
    type: constants.DISPLAY_MODAL,
    payload: {
      key,
      display,
    },
  };
}

export function loadingData(key, isLoading) {
  return {
    type: constants.LOADING_DATA,
    payload: {
      key,
      isLoading,
    },
  };
}

export function timeFilter(timerange) {
  return {
    type: constants.TIME_FILTER,
    payload: {
      timerange,
    },
  };
}

export function crudFilter(crud) {
  return {
    type: constants.CRUD_FILTER,
    payload: {
      crud,
    },
  };
}
