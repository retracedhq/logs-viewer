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
  refreshToken?: () => void;
  toggleDisplay?: {
    fields?: boolean;
    metadata?: boolean;
  };
};

const store = configStore();

const RetracedEventsBrowser: React.FC<RetracedEventsBrowserProps> = ({
  auditLogToken,
  theme,
  customClass,
  host = "http://localhost:3000/auditlog/viewer/v1",
  header = "Events",
  mount = true,
  disableShowRawEvent,
  fields = [],
  skipViewLogEvent,
  refreshToken,
  toggleDisplay,
}) => {
  return (
    <div
      id="retracedLogsViewerApp"
      className={`retraced-logs-viewer-app u-minHeight--full ${customClass || ""} ${theme || ""}`}>
      <Provider store={store}>
        <EventsBrowser
          auditLogToken={auditLogToken}
          mount={mount}
          headerTitle={header}
          host={host}
          apiTokenHelpURL={"https://boxyhq.com/docs/retraced/apis/enterprise-api"}
          searchHelpURL={"https://boxyhq.com/docs/retraced/apis/graphql#search"}
          fields={fields}
          disableShowRawEvent={disableShowRawEvent}
          skipViewLogEvent={skipViewLogEvent}
          refreshToken={refreshToken}
          toggleDisplay={toggleDisplay}
        />
      </Provider>
    </div>
  );
};

export default RetracedEventsBrowser;
