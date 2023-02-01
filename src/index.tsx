import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { configStore } from "./redux";
import EventsBrowser from "./components/containers/EventsBrowser";

import "./css/index.scss";

const store = configStore();
export default class RetracedEventsBrowser extends React.Component {
  static propTypes = {
    auditLogToken: PropTypes.string,
    apiTokenHelpURL: PropTypes.string,
    searchHelpURL: PropTypes.string,
    theme: PropTypes.string,
    customClass: PropTypes.string,
    host: PropTypes.string,
    header: PropTypes.string,
    mount: PropTypes.bool,
    disableShowRawEvent: PropTypes.bool,
    fields: PropTypes.array,
    breakpoint: PropTypes.string,
  };
  static defaultProps = {
    header: "Events",
    host: "http://localhost:3000/auditlog/viewer/v1",
    apiTokenHelpURL: "https://boxyhq.com/docs/retraced/apis/enterprise-api",
    searchHelpURL: "https://boxyhq.com/docs/retraced/apis/graphql#search",
    mount: true,
  };
  render() {
    return (
      <div
        id="retracedLogsViewerApp"
        className={`retraced-logs-viewer-app u-minHeight--full ${this.props.customClass || ""} ${
          this.props.theme || ""
        }`}>
        <Provider store={store}>
          <EventsBrowser
            breakpoint={this.props.breakpoint}
            auditLogToken={this.props.auditLogToken}
            mount={this.props.mount}
            headerTitle={this.props.header}
            host={this.props.host}
            apiTokenHelpURL={this.props.apiTokenHelpURL}
            searchHelpURL={this.props.searchHelpURL}
            fields={this.props.fields || []}
            disableShowRawEvent={this.props.disableShowRawEvent}
          />
        </Provider>
      </div>
    );
  }
}
