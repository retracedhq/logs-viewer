import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { configStore } from "./redux";
import EventsBrowser from "./components/containers/EventsBrowser";

import "./css/index.scss";

type RetracedEventsBrowserProps = typeof RetracedEventsBrowser.propTypes;

const store = configStore();
const eventField = PropTypes.shape({
  label: PropTypes.string,
  type: PropTypes.string,
  getValue: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  field: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
});
export default class RetracedEventsBrowser extends React.Component<RetracedEventsBrowserProps> {
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
    fields: PropTypes.arrayOf(eventField),
    skipViewLogEvent: PropTypes.bool,
  };

  static defaultProps = {
    header: "Events",
    host: "http://localhost:3000/auditlog/viewer/v1",
    apiTokenHelpURL: "https://boxyhq.com/docs/retraced/apis/enterprise-api",
    searchHelpURL: "https://boxyhq.com/docs/retraced/apis/graphql#search",
    mount: true,
    fields: [],
    skipViewLogEvent: false,
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
            auditLogToken={this.props.auditLogToken}
            mount={this.props.mount}
            headerTitle={this.props.header}
            host={this.props.host}
            apiTokenHelpURL={this.props.apiTokenHelpURL}
            searchHelpURL={this.props.searchHelpURL}
            fields={this.props.fields}
            disableShowRawEvent={this.props.disableShowRawEvent}
            skipViewLogEvent={this.props.skipViewLogEvent}
          />
        </Provider>
      </div>
    );
  }
}
