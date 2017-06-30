import * as React from "react";
import { connect } from "react-redux";
import * as autobind from "react-autobind";

export default class MobileEventRow extends React.Component {
  
  render() {
    return (
      <div className="TableRow-wrapper flex-auto">
        <div className="TableRow flex mobile-row">
          <div className="TableRow-content flex flex1">
            <div className="flex-column flex1 u-overflow--hidden">
              <div className="flex flex1">
                <div className="flex flex1 ellipsis-overflow">
                  <div className="u-fontWeight--normal u-color--dustyGray u-fontSize--normal u-lineHeight--normal ellipsis-overflow">
                    <ReactMarkdown
                      className="EventItem u-fontWeight--medium ellipsis-overflow u-lineHeight--normal u-display--inlineBlock"
                      sourcePos={true}
                      renderers={props.renderers}
                      source={props.event.display_title}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex1 u-marginTop--small">
                <div className="flex flex1 u-paddingRight--small ellipsis-overflow">
                  <p className="u-fontWeight--normal u-color--dustyGray u-fontSize--normal u-lineHeight--normal">
                    Date: <span className="u-fontWeight--medium u-color--tundora">{moment(props.event.canonical_time).fromNow()}</span>
                  </p>
                </div>
                <div className="flex flex1 u-paddingLeft--small ellipsis-overflow">
                  <p className="u-fontWeight--normal u-color--dustyGray u-fontSize--normal u-lineHeight--normal">
                    Group: <span className="u-fontWeight--medium u-color--tundora">{props.event.group && props.event.group.name}</span>
                  </p>
                </div>
                <div className="flex flex-auto u-paddingLeft--small justifyContent--flexEnd">
                  <p className="u-fontWeight--normal u-color--dustyGray u-fontSize--normal u-lineHeight--normal">
                    Location: <span className="u-fontWeight--medium u-color--tundora">{props.event.country || props.event.source_ip}</span>
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