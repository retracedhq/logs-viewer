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
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};
