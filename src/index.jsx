import * as React from "react";
import { AppContainer } from "react-hot-loader";
import * as PropTypes from "prop-types";
import { Provider } from "react-redux";
import { configStore } from "./redux";
import EventsBrowser from "./components/containers/EventsBrowser";

import "./css/index.scss";

const store = configStore();
export default class RetracedEventsBrowser extends React.Component {
  static propTypes = {
    auditLogToken: PropTypes.string,
    theme: PropTypes.string,
  };
  static defaultProps = {
    theme: "light",
    header: "Events"
  }
  render() {
    return (
      <div id="retracedLogsViewerApp">
        <AppContainer>
          <Provider store={store}>
            <EventsBrowser auditLogToken={this.props.auditLogToken} theme={this.props.theme} headerTitle={this.props.header} />
          </Provider>
        </AppContainer>
      </div>
    );
  }
};
