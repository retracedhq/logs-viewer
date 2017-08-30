import * as React from "react";
import { connect } from "react-redux";
import * as autobind from "react-autobind";
import * as ReactMarkdown from "react-markdown";
import * as moment from "moment";
import ResizeAware from 'react-resize-aware';
import Tooltip from "../shared/Tooltip";

export default class EventRow extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      eventInfoToken: false,
      enableEventTooltip: false,
      showEventTooltip: false,
    };
  }

  handleEventRowResize({width, height}) {
    console.log(width, height);
    const eventRowWidth = this.eventRowDiv.offsetWidth;
    this.setState({ enableEventTooltip: (eventRowWidth <= width) ? true : false });
  }

  render() {
    return (
      <div className="TableRow-wrapper flex-auto">
        <div className="TableRow flex">
          <div className="TableRow-content flex flex1">
            <div className="flex flex1">
              <div className={`flex flex1 content-section ellipsis-overflow ${this.state.enableEventTooltip ? "u-cursor--pointer" : null}`} 
                ref={(eventRowDiv) => this.eventRowDiv = eventRowDiv}
                onMouseEnter={() => {this.setState({ showEventTooltip: true })}}
                onMouseLeave={() => {this.setState({ showEventTooltip: false })}}>
                <ResizeAware
                  onlyEvent
                  onResize={this.handleEventRowResize}
                >
                  <ReactMarkdown
                    className="EventItem u-fontWeight--medium ellipsis-overflow u-lineHeight--more"
                    sourcePos={true}
                    renderers={this.props.renderers}
                    source={this.props.event.display.markdown}
                  />
                </ResizeAware>
                <Tooltip
                  visible={this.state.showEventTooltip && this.state.enableEventTooltip}
                  text={this.props.event.description}
                  minWidth="80"
                  position="center-right"
                />
              </div>
              <div style={{ maxWidth: "180px" }} className="flex flex1 content-section">
                <p className="u-fontWeight--medium u-color--tundora u-lineHeight--more">
                  {moment(this.props.event.canonical_time).fromNow()}
                </p>
              </div>
              <div style={{ maxWidth: "180px" }} className="flex flex1 content-section">
                <p className="u-fontWeight--medium u-color--tundora u-lineHeight--more">
                  {this.props.event.country || this.props.event.source_ip}
                </p>
              </div>
              <div style={{ maxWidth: "20px" }} className="flex flex1 content-section actions-section justifyContent--flexEnd">
                <div className="flex-column flex-auto icon-wrapper flex-verticalCenter">
                  <span className="icon clickable u-codeIcon" 
                    onClick={this.props.openModal}
                    onMouseEnter={() => {this.setState({ eventInfoToken: true })}}
                    onMouseLeave={() => {this.setState({ eventInfoToken: false })}}>
                    <Tooltip
                      visible={this.state.eventInfoToken}
                      text="More Info"
                      minWidth="80"
                      position="bottom-left"
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}