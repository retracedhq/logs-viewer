import * as React from "react";
import { AppContainer } from "react-hot-loader";
import { render } from "react-dom";
import * as PropTypes from "prop-types";
import { Provider } from "react-redux";
import { configStore, getStore } from "./redux";
import EventsBrowser from "./components/containers/EventsBrowser";

import "./css/index.scss";

class RetracedEventsBrowser extends React.Component {
  static propTypes = {
    auditLogToken: PropTypes.string,
    theme: PropTypes.string,
  };
  static defaultProps = {
    theme: "light",
  }
  render() {
    return (
      <AppContainer>
        <Provider store={getStore()}>
          <EventsBrowser auditLogToken={this.props.auditLogToken} theme={this.props.theme} />
        </Provider>
      </AppContainer>
    );
  }
};

configStore().then(() => {
  render((
    <RetracedEventsBrowser />
  ), document.getElementById("retracedLogsViewerApp"));
});

export default RetracedEventsBrowser;
