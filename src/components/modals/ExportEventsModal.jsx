import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import Modal from "react-modal";

export default class ExportEventsModal extends React.Component {
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    return (
      <div>
          <h1>Export Events</h1>
          <div className="modal-content">
              <h3>Export your events to CSV</h3>
              <p>Export your current search query to CSV. You can select presets from previous exports you’ve made or export and save your current query so that you can easily export any new events in the future. This export will only contain the events that have occured since your last export with the same query.</p>
              <div className="query-select">
                  <div className="select-menu">
                    <select className="">
                      <option value="current">Use current search query</option>
                    </select>
                    <span className="icon clickable u-dropdownArrowIcon"></span>
                  </div>
                  <button className="Button primary">Export</button>
              </div>
          </div>
      </div>
    );
  }
}

