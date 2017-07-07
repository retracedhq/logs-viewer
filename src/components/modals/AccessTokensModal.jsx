import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import Modal from "react-modal";

export default class AccessTokensModal extends React.Component {
  
  constructor() {
    super();
    autoBind(this);
  }

  render() {
    return (
      <div>
          <h1>Access Tokens</h1>
          <div>
              <h3>Export your events to CSV</h3>
              <p>Export your current search query to CSV. You can select presets from previous exports you’ve made or export and save your current query so that you can easily export any new events in the future. This export will only contain the events that have occured since your last export with the same query.</p>
              <div>
                  <select>
                      <option value="current">Use current search query</option>
                  </select>
                  <button>Export</button>
              </div>
          </div>
      </div>
    );
  }
}

