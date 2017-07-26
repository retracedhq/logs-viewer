import * as React from "react";

export default class FixedTableHeader extends React.Component {

  render() {
    const {
      className,
      items,
    } = this.props;

    const renderItem = (item, i) => (
      <div key={`${item.label}-${i}`} className={`flex title-section ${item.className || ""}`} style={item.style}>
        <p className="FixedTableHeader-title">{item.label}</p>
      </div>
    );

    return (
      <div className="FixedTableHeader-wrapper flex1">
        <div className={`FixedTableHeader flex ${className || ""}`}>
          <div className="FixedTableHeader-content flex flex1">
            <div className="flex flex1">
              {items && items.map(renderItem)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
