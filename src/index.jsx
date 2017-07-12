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
    customClass: PropTypes.string,
  };
  static defaultProps = {
    header: "Events"
  }
  render() {
    return (
      <div id="retracedLogsViewerApp" className={`retraced-logs-viewer-app ${this.props.customClass || ""} ${this.props.theme || ""}`}>
        <AppContainer>
          <Provider store={store}>
            <EventsBrowser auditLogToken={this.props.auditLogToken} headerTitle={this.props.header} />
          </Provider>
        </AppContainer>
      </div>
    );
  }
};
