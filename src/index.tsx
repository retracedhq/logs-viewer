import React from "react";
import { Provider } from "react-redux";
import { configStore } from "./redux";
import EventsBrowser from "./components/containers/EventsBrowser";

import "./css/index.scss";

type EventField = {
  label: string;
  type: string;
  getValue: any;
  field: string;
  className: string;
  style: any;
};

type RetracedEventsBrowserProps = {
  auditLogToken: string;
  theme?: string;
  customClass?: string;
  host?: string;
  header?: string;
  mount?: boolean;
  disableShowRawEvent?: boolean;
  fields?: EventField[];
  skipViewLogEvent?: boolean;
};

const store = configStore();
export default class RetracedEventsBrowser extends React.Component<RetracedEventsBrowserProps> {
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
            mount={this.props.mount === false ? false : true}
            headerTitle={this.props.header || "Events"}
            host={this.props.host || "http://localhost:3000/auditlog/viewer/v1"}
            apiTokenHelpURL={"https://boxyhq.com/docs/retraced/apis/enterprise-api"}
            searchHelpURL={"https://boxyhq.com/docs/retraced/apis/graphql#search"}
            fields={this.props.fields || []}
            disableShowRawEvent={this.props.disableShowRawEvent}
            skipViewLogEvent={this.props.skipViewLogEvent}
          />
        </Provider>
      </div>
    );
  }
}
