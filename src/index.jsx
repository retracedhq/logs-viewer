import * as React from "react";
import { AppContainer } from "react-hot-loader";
import Root from "./Root.jsx";
import * as PropTypes from "prop-types";


export default class RetracedEventsBrowser extends React.Component {
  static propTypes = {
    auditLogToken: PropTypes.string,
    theme: PropTypes.string,
  };
  static defaultProps = {
    theme: "light",
  }

  render() {
    return (
      <div id="retracedLogsViewerApp">
        <AppContainer>
          <Root auditLogToken={this.props.auditLogToken} theme={this.props.theme}/>
        </AppContainer>
      </div>
    );
  }
};
