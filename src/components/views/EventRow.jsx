import React from "react";
import autobind from "react-autobind";
import ReactMarkdown from "react-markdown";
import Tooltip from "../shared/Tooltip";

export default class EventRow extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      eventInfoToken: false,
      items: props.fields
    };
  }

  getItemValue = (object, selector) => {
    if (!selector) {
      return '';
    }
    if (selector.indexOf('.') !== -1) {
      const parts = selector.split('.');
      let data = object;
      for (let i = 0; i < parts.length; i++) {
        data = data[parts[i]]
        if (!data) {
          return undefined;
        }
      }
      return data;
    } else {
      return object[selector];
    }
  }

  render() {
    return (
      <div className="TableRow-wrapper flex-auto">
        <div className="TableRow flex">
          <div className="TableRow-content flex flex1">
            <div className="flex flex1">
              { this.state.items.map((i, idx) => {
                if (i.type === 'markdown') {
                  return (
                    <div
                      key={ idx } className={ `flex flex1 content-section` }>
                      <ReactMarkdown
                        className="EventItem u-fontWeight--medium u-lineHeight--more"
                        sourcePos={ true }
                        components={ this.props.renderers }
                        children={ i.getValue ? i.getValue(this.props.event) : this.getItemValue(this.props.event, i.field) }
                      />
                    </div>
                  );
                } else if (i.type === "showEvent") {
                  return (
                    <div
                      key={ idx }
                      style={ i.style }
                      className="flex flex1 content-section actions-section justifyContent--flexEnd"
                    >
                      <div className="flex-column flex-auto icon-wrapper flex-verticalCenter">
                        <span
                          className="icon clickable u-codeIcon"
                          onClick={ this.props.openModal }
                          onMouseEnter={ () => {
                            this.setState({ eventInfoToken: true });
                          } }
                          onMouseLeave={ () => {
                            this.setState({ eventInfoToken: false });
                          } }
                        >
                          <Tooltip
                            visible={ this.state.eventInfoToken }
                            text="More Info"
                            minWidth="80"
                            position="bottom-left"
                          />
                        </span>
                      </div>
                    </div>)
                } else {
                  return (<div
                    key={ idx }
                    style={ i.style }
                    className="flex flex1 content-section alignItems--center"
                  >
                    <p className="u-fontWeight--medium u-color--tundora u-lineHeight--more">
                      { i.getValue ? i.getValue(this.props.event) : this.getItemValue(this.props.event, i.field) }
                    </p>
                  </div>)
                }
              }) }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
