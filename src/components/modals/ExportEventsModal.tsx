import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import { createSavedExport, fetchSavedExports, renderSavedExport } from "../../redux/data/exports/thunks";

const ExportEventsModal = (props) => {
  const { savedExports, exporting, searchInputQuery } = props;
  const exportName = useRef(null);
  const [searchBody, setSearchBody] = useState("current");
  const [newSavedExport, setNewSavedExport] = useState(false);
  const [newSavedExportName, setNewSavedExportName] = useState("");
  const [nameEmptyError, setNameEmptyError] = useState(true);
  const [showErrorClass, setShowErrorClass] = useState(false);

  useEffect(() => {
    fetchSavedExports();
  }, [fetchSavedExports]);

  useEffect(() => {
    if (newSavedExport) {
      setTimeout(() => {
        exportName.current.focus();
      }, 10);
    }
  }, [newSavedExport]);

  const handleExportCSV = (query, name) => {
    const filters = props.crudFilters;
    let dates = {};
    let searchQuery = query;

    // If we have date filters (TEMP) convert to MS
    if (props.dateFilters) {
      let startDate = props.dateFilters.startDate ? props.dateFilters.startDate.valueOf() : null;
      let endDate = props.dateFilters.endDate ? props.dateFilters.endDate.valueOf() : null;

      dates = {
        startDate,
        endDate,
      };
    }

    if (!nameEmptyError) {
      // TEMP: Remove all crud and date stuff from string
      if (query.includes("crud:")) {
        const scrubbed = query.split("crud:")[0];
        searchQuery = scrubbed;
      }

      props.createSavedExport(searchQuery, filters, dates, name);
      setNewSavedExport(false);
      setShowErrorClass(false);
    } else {
      setShowErrorClass(true);
    }
  };

  const updateSearchBody = (e) => {
    setSearchBody(e.target.value);
  };

  const checkForNewExport = () => {
    if (searchBody === "current") {
      setNewSavedExport(true);
    } else {
      props.renderSavedExport(searchBody);
    }
  };

  const handleNameUpdate = (e) => {
    if (e.target.value !== "") {
      setNewSavedExportName(e.target.value);
      setNameEmptyError(false);
    } else {
      setNameEmptyError(true);
    }
  };

  const reset = () => {
    setNewSavedExport(false);
    setShowErrorClass(false);
    setNameEmptyError(true);
  };
  return (
    <div>
      <h1 className="u-fontWeight--normal">Export Events</h1>
      <div className="modal-content">
        {newSavedExport ? (
          <div>
            <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">
              Name your search
            </h3>
            <p className="u-fontWeight--normal u-fontSize--normal u-marginBottom--more">
              Save this search query so that you can easily use these presets to export any new events in the
              future that match your new query.
            </p>
            <div className="flex flexWrap--wrap justifyContent--flexEnd">
              <input
                type="text"
                className={`Input u-marginBottom--more ${showErrorClass ? "has-error" : ""}`}
                ref={exportName}
                placeholder="Release 1.0.0"
                onChange={(e) => {
                  handleNameUpdate(e);
                }}
              />
              <button
                className="Button secondary flex-auto u-marginLeft--normal"
                disabled={exporting ? true : false}
                onClick={() => {
                  reset();
                }}>
                Back
              </button>
              <button
                className="Button primary flex-auto u-marginLeft--normal"
                disabled={exporting ? true : false}
                onClick={() => {
                  handleExportCSV(searchInputQuery, newSavedExportName);
                }}>
                {exporting ? "Saving..." : "Name & Save"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="u-fontWeight--medium u-marginBottom--normal u-fontSize--large">
              Export your events to CSV
            </h3>
            <p className="u-fontWeight--normal u-fontSize--normal u-marginBottom--more">
              Export your current search query to CSV. You can select presets from previous exports you’ve
              made or export and save your current query so that you can easily export any new events in the
              future. This export will only contain the events that have occured since your last export with
              the same query.
            </p>
            <div className="flex flex1">
              <div className="select-menu flex1">
                <select
                  className="Select"
                  onChange={(e) => {
                    updateSearchBody(e);
                  }}>
                  <option value="current">Use current search query</option>
                  {savedExports.length
                    ? savedExports.map((ex, i) => (
                        <option value={ex.id} key={i}>
                          {ex.name}
                        </option>
                      ))
                    : null}
                </select>
              </div>
              <button
                className="Button primary flex-atuo u-marginLeft--normal"
                disabled={exporting ? true : false}
                onClick={() => {
                  checkForNewExport();
                }}>
                {exporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  savedExports: state.data.exportsData.savedSearchQueries,
  exporting: state.ui.loadingData.exportCSVLoading,
});

const mapDispatchToProps = (dispatch) => ({
  createSavedExport: (query, filters, dates, name) =>
    dispatch(createSavedExport(query, filters, dates, name)),
  fetchSavedExports: () => dispatch(fetchSavedExports()),
  renderSavedExport: (id) => dispatch(renderSavedExport(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportEventsModal);
