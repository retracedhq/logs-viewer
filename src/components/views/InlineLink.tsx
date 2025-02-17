import _ from "lodash";

type propTypes = {
  href?: any;
  children?: any;
};

const InlineLink: React.FC<propTypes> = (props) => {
  if (_.startsWith(props.href, "http://") || _.startsWith(props.href, "https://")) {
    return <a href={props.href}>{props.children}</a>;
  }

  return (
    <a href={props.href} className="u-color--curiousBlue u-textDecoration--underlineOnHover">
      {props.children}
    </a>
  );
};

export default InlineLink;
