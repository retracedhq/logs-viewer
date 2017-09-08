import * as React from "react";
import { connect } from "react-redux";
import * as autobind from "react-autobind";
import * as ReactMarkdown from "react-markdown";
import * as moment from "moment";

export default class MobileEventRow extends React.Component {
  
  render() {
    return (
      <div className={`TableRow-wrapper flex-auto u-cursor--pointer ${this.props.index === 0 ? "u-borderTop--gray" : ""}`} onClick={this.props.openModal}>
        <div className="TableRow flex mobile-row">
          <div className="TableRow-content flex flex1">
            <div className="flex-column flex1 u-overflow--hidden">
              <div className="flex flex1">
                <div className="flex flex1 ellipsis-overflow">
                  <div className="u-color--dustyGray u-fontSize--normal u-lineHeight--normal ellipsis-overflow">
                    <ReactMarkdown
                      className="EventItem u-fontWeight--medium ellipsis-overflow u-lineHeight--more u-display--inlineBlock"
                      sourcePos={true}
                      renderers={this.props.renderers}
                      source={this.props.event.display.markdown}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex1 u-marginTop--normal">
                <div className="flex flex1 u-paddingRight--small ellipsis-overflow">
                  <p className="u-fontWeight--normal u-color--dustyGray u-fontSize--normal u-lineHeight--normal">
                    Date: <span className="u-fontWeight--medium u-color--tundora">{moment(this.props.event.canonical_time).fromNow()}</span>
                  </p>
                </div>
                <div className="flex flex-auto u-paddingLeft--small justifyContent--flexEnd">
                  <p className="u-fontWeight--normal u-color--dustyGray u-fontSize--normal u-lineHeight--normal">
                    Location: <span className="u-fontWeight--medium u-color--tundora">{this.props.event.country || this.props.event.source_ip}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}