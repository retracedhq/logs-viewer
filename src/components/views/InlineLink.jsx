import _ from "lodash";

const InlineLink = () => {
  if (_.startsWith(this.props.href, "http://") || _.startsWith(this.props.href, "https://")) {
    return <a href={this.props.href}>{this.props.children}</a>;
  }

  return (
    <a href={this.props.href} className="u-color--curiousBlue u-textDecoration--underlineOnHover">
      {this.props.children}
    </a>
  );
};

export default InlineLink;
