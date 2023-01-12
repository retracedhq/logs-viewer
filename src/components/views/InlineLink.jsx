import React from "react";
import _ from "lodash";

export default class InlineLink extends React.Component {
  render() {
    if (
      _.startsWith(this.props.href, "http://") ||
      _.startsWith(this.props.href, "https://")
    ) {
      return <a href={this.props.href}>{this.props.children}</a>;
    }

    return (
      <a
        href={this.props.href}
        className="u-color--curiousBlue u-textDecoration--underlineOnHover"
      >
        {this.props.children}
      </a>
    );
  }
}
