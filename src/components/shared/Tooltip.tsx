import React from "react";

type propTypes = {
  className?: string;
  visible: boolean;
  text: string;
  content?: Node;
  position: string;
  minWidth: string;
};

const Tooltip: React.FC<propTypes> = ({
  className,
  visible,
  text,
  content,
  position = "top-center",
  minWidth = "80",
}: propTypes) => {
  const wrapperClass = `Tooltip-wrapper tooltip-${position} ${className || ""} ${visible ? "is-active" : ""}`;

  return (
    <span className={wrapperClass} style={{ minWidth: `${minWidth}px` }}>
      <span className="Tooltip-content">{content || text}</span>
    </span>
  );
};

export default Tooltip;
