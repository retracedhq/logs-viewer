import React from "react";
import autoBind from "react-autobind";

export default class RawEventOutputModal extends React.Component {
  constructor() {
    super();
    autoBind(this);
    this.state = {};
  }

  render() {
    const { rawOutput } = this.props;
    const rawObj = JSON.parse(rawOutput);
    const raw = JSON.stringify(rawObj, null, 2);
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
              value={raw}
            ></textarea>
          </div>
        </div>
      </div>
    );
  }
}
