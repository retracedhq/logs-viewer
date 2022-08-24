import * as React from "react";
import * as autoBind from "react-autobind";
import * as PropTypes from 'prop-types';
import Modal from "react-modal";
import * as moment from "moment";
import { connect } from "react-redux";
import { createSavedExport, fetchSavedExports, renderSavedExport } from "../../redux/data/exports/thunks";


class ExportEventsModal extends React.Component {

  constructor() {
    super();
    this.exportName = React.createRef();
    autoBind(this);
    this.state = {
      searchBody: "current",
      newSavedExport: false,
      newSavedExportName: "",
      nameEmptyError: true,
      showErrorClass: false,
    }
  }

  componentDidUpdate() {
    const { newSavedExport } = this.state;
    if (newSavedExport) {
      setTimeout(() => {
        this.exportName.current.focus();
      }, 10);
    }
  }

  componentWillMount() {
    this.props.fetchSavedExports();
  }

  handleExportCSV(query, name) {
    const filters = this.props.crudFilters;
    let dates = {};
    let searchQuery = query;

    // If we have date filters (TEMP) convert to MS
    if(this.props.dateFilters) {
      let startDate = this.props.dateFilters.startDate ? 
        this.props.dateFilters.startDate.valueOf() : null;
      let endDate = this.props.dateFilters.endDate ? 
        this.props.dateFilters.endDate.valueOf() : null;

      dates = {
        startDate,
        endDate
      };
    }
    
    if(!this.state.nameEmptyError) {
      // TEMP: Remove all crud and date stuff from string
      if(query.includes("crud:")) {
        const scrubbed = query.split("crud:")[0];
        searchQuery = scrubbed;
      }

      this.props.createSavedExport(searchQuery, filters, dates, name);
      this.setState({ newSavedExport: false, showErrorClass: false });
    } else {
      this.setState({ showErrorClass: true });
    }
  }

  updateSearchBody(e) {
    this.setState({ searchBody: e.target.value })
  }

  checkForNewExport() {
    if (this.state.searchBody === "current") {
      this.setState({ newSavedExport: true });
    } else {
      this.props.renderSavedExport(this.state.searchBody);
    }
  }

  handleNameUpdate(e) {
    if(e.target.value !== "") {
      this.setState({ newSavedExportName: e.target.value, nameEmptyError: false });
    } else {
      this.setState({ nameEmptyError: true });
    }
  }

  reset() {
    this.setState({ 
      newSavedExport: false, 
      showErrorClass: false, 
      nameEmptyError: true 
    });
  }

  render() {
    const { savedExports, exporting, searchInputQuery, crudFilters, dateFilters } = this.props;
    const { searchBody, newSavedExportName } = this.state;
    return (
      <div>
        <h1 className="u-fontWeight--normal">Export Events</h1>
        <div className="modal-content">
          {this.state.newSavedExport ?
            <div>
              <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">Name your search</h3>
              <p className="u-fontWeight--normal u-fontSize--normal u-marginBottom--more">Save this search query so that you can easily use these presets to export any new events in the future that match your new query.</p>
              <div className="flex flexWrap--wrap justifyContent--flexEnd">
                <input type="text" className={`Input u-marginBottom--more ${this.state.showErrorClass ? "has-error" : ""}`} ref={this.exportName} placeholder="Release 1.0.0" onChange={(e) => { this.handleNameUpdate(e) }} />
                <button className="Button secondary flex-auto u-marginLeft--normal" disabled={exporting ? true : false} onClick={() => { this.reset(); }}>Back</button>                
                <button className="Button primary flex-auto u-marginLeft--normal" disabled={exporting ? true : false} onClick={() => { this.handleExportCSV(searchInputQuery, newSavedExportName) }}>{exporting ? "Saving..." : "Name & Save"}</button>
              </div>
            </div>
            :
            <div>
              <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">Export your events to CSV</h3>
              <p className="u-fontWeight--normal u-fontSize--normal u-marginBottom--more">Export your current search query to CSV. You can select presets from previous exports you’ve made or export and save your current query so that you can easily export any new events in the future. This export will only contain the events that have occured since your last export with the same query.</p>
              <div className="flex flex1">
                <div className="select-menu flex1">
                  <select className="Select" onChange={(e) => { this.updateSearchBody(e) }}>
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
    exporting: state.ui.loadingData.exportCSVLoading,
  }),
  dispatch => ({
    createSavedExport(query, filters, dates, name) {
      return dispatch(createSavedExport(query, filters, dates, name));
    },
    fetchSavedExports() {
      return dispatch(fetchSavedExports());
    },
    renderSavedExport(id) {
      return dispatch(renderSavedExport(id));
    },
  }),
)(ExportEventsModal);

