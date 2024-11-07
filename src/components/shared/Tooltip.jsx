const Tooltip = (props) => {
  const { className, visible, text, content, position, minWidth } = props;

  const wrapperClass = `Tooltip-wrapper tooltip-${position} ${className || ""} ${visible ? "is-active" : ""
    }`;

  return (
    <span className={wrapperClass} style={{ minWidth: `${minWidth}px` }}>
      <span className="Tooltip-content">{content || text}</span>
    </span>
  );
}

export default Tooltip;