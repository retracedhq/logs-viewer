import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import Modal from "react-modal";

export default class ExportEventsModal extends React.Component {
  
  constructor() {
    super();
    autoBind(this);
    this.state = {
      searchQuery: "current",
      newSavedExport: false,
      newSavedExportName: "",
    }
  }

  updateSearchQuery(e) {
    this.setState({ searchQuery: e.target.value })
  }

  checkForNewExport() {
    if(this.state.searchQuery === "current") {
      this.setState({ newSavedExport: true })
    } else {
      this.props.exportCSV(this.state.searchQuery, null);
    }
  }

  render() {
    const { savedExports } = this.props;
    const { searchQuery, newSavedExportName } = this.state;
    return (
      <div>
          <h1>Export Events</h1>
          <div className="modal-content">
              { this.state.newSavedExport ? 
                <div>
                  <h3>Name your search</h3>
                  <p>Save this search query so that you can easily use these presets to export any new events in the future that match your new query.</p>
                  <div className="name-input">
                    <input type="text" placeholder="Release 1.0.0" onChange={(e) => { this.setState({ newSavedExportName: e.target.value }) }}  />
                    <button className="Button primary" onClick={() => { this.props.exportCSV(searchQuery, newSavedExportName) }}>Name & Save</button>
                  </div>
                </div>
              :
                <div>
                  <h3>Export your events to CSV</h3>
                  <p>Export your current search query to CSV. You can select presets from previous exports you’ve made or export and save your current query so that you can easily export any new events in the future. This export will only contain the events that have occured since your last export with the same query.</p>
                  <div className="query-select">
                      <div className="select-menu">
                        <select className="" onChange={(e) => { this.updateSearchQuery(e) }}>
                          <option value="current">Use current search query</option>
                          { savedExports.length ?
                            savedExports.map((ex, i ) => (
                              <option value={ex.id} key={i}>{ex.name}</option> 
                            )) 
                          : null}
                        </select>
                        <span className="icon clickable u-dropdownArrowIcon"></span>
                      </div>
                      <button className="Button primary" onClick={() => { this.checkForNewExport() }}>Export</button>
                  </div>
                </div>
              }
          </div>
      </div>
    );
  }
}

