import * as React from "react";
import * as ReactDOM from "react-dom";
import * as RetracedEventsBrowser from "../index";

ReactDOM.render(
  <RetracedEventsBrowser auditLogToken="123" />,
  document.getElementById("app")
);
