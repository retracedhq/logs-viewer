import React from "react";
import autoBind from "react-autobind";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

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
            <AceEditor
              mode="javascript"
              theme="github"
              width="100%"
              height="300px"
              readOnly={true}
              showGutter={false}
              showPrintMargin={false}
              editorProps={{ $blockScrolling: true }}
              value={raw}
              fontSize={14}
            />
          </div>
        </div>
      </div>
    );
  }
}
