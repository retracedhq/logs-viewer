import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import Modal from "react-modal";
import { connect } from "react-redux";
import { createSavedExport, fetchSavedExports } from "../../redux/data/exports/thunks";


class ExportEventsModal extends React.Component {

  constructor() {
    super();
    autoBind(this);
    this.state = {
      searchQuery: "current",
      newSavedExport: false,
      newSavedExportName: "",
    }
  }

  componentWillMount() {
    this.props.fetchSavedExports();
  }

  handleExportCSV(query, name) {
    this.exportCSV(query, name);
    this.setState({ newSavedExport: false });
  }

  updateSearchQuery(e) {
    this.setState({ searchQuery: e.target.value })
  }

  checkForNewExport() {
    if (this.state.searchQuery === "current") {
      this.setState({ newSavedExport: true });
    } else {
      this.handleExportCSV(this.state.searchQuery, null);
    }
  }

  exportCSV(query, name) {
    if (query !== "current") {
      // Fetch download
      console.log("Fetching export for this id: " + query);
    } else {
      const checkedName = name === "" ? this.state.searchQuery : name;
      this.props.createSavedExport(this.state.searchQuery, checkedName)
    }
  }

  render() {
    const { savedExports, exporting } = this.props;
    const { searchQuery, newSavedExportName } = this.state;
    return (
      <div>
        <h1 className="u-fontWeight--normal">Export Events</h1>
        <div className="modal-content">
          {this.state.newSavedExport ?
            <div>
              <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">Name your search</h3>
              <p className="u-fontWeight--normal u-fontSize--normal u-marginBottom--more">Save this search query so that you can easily use these presets to export any new events in the future that match your new query.</p>
              <div className="flex flex1">
                <input type="text" className="Input flex1" placeholder="Release 1.0.0" onChange={(e) => { this.setState({ newSavedExportName: e.target.value }) }} />
                <button className="Button primary flex-auto u-marginLeft--normal" disabled={exporting ? true : false} onClick={() => { this.handleExportCSV(searchQuery, newSavedExportName) }}>{exporting ? "Saving..." : "Name & Save"}</button>
              </div>
            </div>
            :
            <div>
              <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">Export your events to CSV</h3>
              <p className="u-fontWeight--normal u-fontSize--normal u-marginBottom--more">Export your current search query to CSV. You can select presets from previous exports you’ve made or export and save your current query so that you can easily export any new events in the future. This export will only contain the events that have occured since your last export with the same query.</p>
              <div className="flex flex1">
                <div className="select-menu flex1">
                  <select className="Select" onChange={(e) => { this.updateSearchQuery(e) }}>
                    <option value="current">Use current search query</option>
                    {savedExports.length ?
                      savedExports.map((ex, i) => (
                        <option value={ex.id} key={i}>{ex.name}</option>
                      ))
                      : null}
                  </select>
                </div>
                <button className="Button primary flex-atuo u-marginLeft--normal" disabled={exporting ? true : false} onClick={() => { this.checkForNewExport() }}>{exporting ? "Exporting..." : "Export"}</button>
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    savedExports: state.data.exportsData.savedSearchQueries,
  }),
  dispatch => ({
    createSavedExport(query, name) {
      return dispatch(createSavedExport(query, name));
    },
    fetchSavedExports() {
      return dispatch(fetchSavedExports());
    },
  }),
)(ExportEventsModal);

