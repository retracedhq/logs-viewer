import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import AceEditor from "react-ace";
import Modal from "react-modal";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

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
            />
          </div>
        </div>
      </div>
    );
  }
}

