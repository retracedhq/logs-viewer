import * as React from "react";
import * as _ from "lodash";
import { Provider } from "react-redux";
import { createStore } from "./redux";
import EventsBrowser from "./components/containers/EventsBrowser";

import "./css/index.scss";

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={createStore()}>
        <EventsBrowser />
      </Provider>
    );
  }
}
