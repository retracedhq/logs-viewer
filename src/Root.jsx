import * as React from "react";
import * as _ from "lodash";
import { Provider } from "react-redux";
import { createStore } from "./redux";
import EventsBrowser from "./components/containers/EventsBrowser.jsx";

import "./css/index.scss";

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={createStore()}>
        <EventsBrowser theme="light" auditLogToken={this.props.auditLogToken} theme={this.props.theme}/>
      </Provider>
    );
  }
}
