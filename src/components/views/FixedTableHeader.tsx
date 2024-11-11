const FixedTableHeader = (props) => {
  const { className, items } = props;

  const renderItem = (item, i) => {
    const label = typeof item.label === "string" ? item.label : "";
    return (
      <div
        data-testid={`headers-${label}-${i}`}
        key={`${item.label}-${i}`}
        className={`flex title-section ${item.className || ""}`}
        style={item.style}>
        <p className="FixedTableHeader-title">{label}</p>
      </div>
    );
  };

  return (
    <div className="FixedTableHeader-wrapper flex1">
      <div className={`FixedTableHeader flex ${className || ""}`}>
        <div className="FixedTableHeader-content flex flex1">
          <div className="flex flex1">{items && items.map(renderItem)}</div>
        </div>
      </div>
    </div>
  );
};

export default FixedTableHeader;
