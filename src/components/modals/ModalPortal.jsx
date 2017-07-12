import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import Modal from "react-modal";

export default class ModalPortal extends React.Component {

  constructor() {
    super();
    autoBind(this);
  }

  generateClassNames() {
    return {
        base: "retraced-logs-viewer-app modal " + this.props.name,
        afterOpen: this.props.name + "_after-open",
        beforeClose: this.props.name + "_before-close"
    }
  }

  render() {
    return (
      <div>
        <Modal 
            isOpen={this.props.isOpen} 
            className={this.generateClassNames()} 
            contentLabel={this.props.name} 
            onRequestClose={this.props.closeModal}
        >   
            {this.props.content}
            <button className="icon u-closeIcon" onClick={this.props.closeModal}>Close</button>
        </Modal>
      </div>
    );
  }
}

