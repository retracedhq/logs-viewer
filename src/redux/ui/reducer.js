// import dayjs from "dayjs";
import { constants } from "./actions";

const loadingState = {
  eventFetchLoading: false,
  exportCSVLoading: false,
  apiTokensLoading: false,
};

export function loadingData(state = loadingState, action = {}) {
  switch (action.type) {
    case constants.LOADING_DATA:
      return Object.assign({}, state, {
        ...state,
        [`${action.payload.key}Loading`]: action.payload.isLoading,
      });
    default:
      return state;
  }
}

// const filterState = {
//   timerange: {
//     start: dayjs().startOf("day").valueOf(),
//     end: dayjs().endOf("day").valueOf(),
//   },
//   crud: "cud",
// };

// export function filterData(state = filterState, action = {}) {
//   switch (action.type) {
//     case constants.TIME_FILTER:
//       return Object.assign({}, state, {
//         timerange: action.payload.timerange,
//       });
//     case constants.CRUD_FILTER:
//       return Object.assign({}, state, {
//         crud: action.payload.crud,
//       });
//     default:
//       return state;
//   }
// }
