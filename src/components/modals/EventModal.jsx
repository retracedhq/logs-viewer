import React from "react";
import autoBind from "react-autobind";

export default class EventModal extends React.Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {};
  }

  render() {
    const { event } = this.props;
    const formattedEvent = JSON.stringify(event, null, 2);
    return (
      <div>
        <h1 className="u-fontWeight--normal">Audit Event Info</h1>
        <div className="modal-content">
          <div>
            <textarea
              style={{
                width: "100%",
                minHeight: "200px",
                height: "300px",
                resize: "none",
              }}
              readOnly
              value={formattedEvent}></textarea>
          </div>
        </div>
      </div>
    );
  }
}
