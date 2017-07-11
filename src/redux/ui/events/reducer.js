import * as _ from "lodash";
const initialState = {
  eventTableHeaderItems: [
    {
      label: "Description",
      style: { maxWidth: "600px" },
    },
    { 
      label: "Date",
      style: { maxWidth: "230px" },
    },
    {
      label: "Group",
      style: { maxWidth: "230px" },
    },
    {
      label: "Location",
      style: { maxWidth: "320px" },
    },
    {
      label: "",
      style: { maxWidth: "100px" },
    },
  ]
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
