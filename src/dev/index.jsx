import ReactDOM from "react-dom/client";
import RetracedEventsBrowser from "../index";

ReactDOM.render(
  <RetracedEventsBrowser auditLogToken="123" />,
  document.getElementById("app")
);
