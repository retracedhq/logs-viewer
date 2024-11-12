import PropTypes from "prop-types";

const Tooltip = (props) => {
  const { className, visible, text, content, position, minWidth } = props;

  const wrapperClass = `Tooltip-wrapper tooltip-${position} ${className || ""} ${visible ? "is-active" : ""}`;

  return (
    <span className={wrapperClass} style={{ minWidth: `${minWidth}px` }}>
      <span className="Tooltip-content">{content || text}</span>
    </span>
  );
};

Tooltip.propTypes = {
  className: PropTypes.string,
  visible: PropTypes.bool,
  text: PropTypes.string,
  content: PropTypes.node,
  position: PropTypes.string,
  minWidth: PropTypes.string,
};

export default Tooltip;
