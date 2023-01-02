import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

export default class InlineLink extends React.Component {
  render() {
    if (_.startsWith(this.props.href, "http://") || _.startsWith(this.props.href, "https://")) {
      return (
        <a href={this.props.href}>{this.props.children}</a>
      );
    }

    return (
      <Link to={this.props.href} className="u-color--curiousBlue u-textDecoration--underlineOnHover">{this.props.children}</Link>
    );
  }
}
