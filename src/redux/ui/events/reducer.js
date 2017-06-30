import * as _ from "lodash";
const initialState = {
  eventTableHeaderItems: [
    {
      label: "Description",
      style: { maxWidth: "700px" },
    },
    { label: "Date" },
    {
      label: "Group",
      style: { maxWidth: "300px" },
    },
    {
      label: "Location",
      style: { maxWidth: "200px" },
    },
    {
      label: "",
      style: { maxWidth: "40px" },
    },
  ]
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
