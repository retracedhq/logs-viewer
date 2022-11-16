import React from "react";
import autobind from "react-autobind";
import ReactMarkdown from "react-markdown";
import moment from "moment";
import Tooltip from "../shared/Tooltip";

export default class EventRow extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      eventInfoToken: false,
    };
  }

  render() {
    return (
      <div className="TableRow-wrapper flex-auto">
        <div className="TableRow flex">
          <div className="TableRow-content flex flex1">
            <div className="flex flex1">
              <div className={`flex flex1 content-section`} >
                <ReactMarkdown
                    className="EventItem u-fontWeight--medium u-lineHeight--more"
                    sourcePos={true}
                    components={this.props.renderers}
                    children={this.props.event.display.markdown}
                  />
              </div>
              <div style={{ maxWidth: "180px" }} className="flex flex1 content-section date alignItems--center">
                <p className="u-fontWeight--medium u-color--tundora u-lineHeight--more">
                  {moment(this.props.event.canonical_time).fromNow()}
                </p>
              </div>
              <div style={{ maxWidth: "180px" }} className="flex flex1 content-section location alignItems--center">
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