import * as React from "react";
import { connect } from "react-redux";
import * as autobind from "react-autobind";
import * as ReactMarkdown from "react-markdown";
import * as moment from "moment";

export default class EventRow extends React.Component {
  render() {
    return (
      <div className="TableRow-wrapper flex-auto">
        <div className="TableRow flex">
          <div className="TableRow-content flex flex1">
            <div className="flex flex1">
              <div className="flex flex-1-auto content-section">
                <ReactMarkdown
                  className="EventItem u-fontWeight--medium ellipsis-overflow u-lineHeight--more"
                  sourcePos={true}
                  renderers={this.props.renderers}
                  source={this.props.event.display.markdown}
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
                  <span className="icon clickable u-codeIcon" onClick={this.props.openModal}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}