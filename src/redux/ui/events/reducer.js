import { constants } from "./actions";

const initialState = {
  eventTableHeaderItems: [
    {
      label: "Description",
      field: "display.markdown",
      type: "markdown",
    },
    {
      label: "Date",
      field: "canonical_time",
    },
    {
      label: "Location",
      field: "source_ip",
    },
  ],
  // keep cursor in state to refetch the just requested page that failed due to token expiry
  cursor: "",
  searchText: "crud:c,u,d",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case constants.STORE_CURSOR:
      return { ...state, cursor: action.payload.cursor };
    case constants.STORE_SEARCH_TEXT:
      return { ...state, searchText: action.payload.searchText };
    default:
      return state;
  }
};
