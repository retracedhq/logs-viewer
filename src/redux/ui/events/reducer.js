import _ from "lodash";
const initialState = {
  eventTableHeaderItems: [
    {
      label: "Description",
      style: { maxWidth: "none" },
      className: "flex-1-auto"
    },
    { 
      label: "Date",
      style: { maxWidth: "180px" },
      className: "flex1"
    },
    {
      label: "Location",
      style: { maxWidth: "180px" },
      className: "flex1"
    },
    {
      label: "",
      style: { maxWidth: "20px" },
      className: "flex1"
    },
  ]
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
