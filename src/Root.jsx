import * as React from "react";
import * as _ from "lodash";
import { Provider } from "react-redux";
import { createStore } from "./redux";

import "./css/index.scss";

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={createStore()}>
        <div>
          <h1>Hello World</h1>
        </div>
      </Provider>
    );
  }
}
