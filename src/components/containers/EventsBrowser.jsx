import * as React from "react";
import { connect } from "react-redux";
import * as autobind from "react-autobind";
import { requestEventSearch } from "../../redux/data/events/thunks";
import FixedTableHeader from "../views/FixedTableHeader";
import InlineLink from "../views/InlineLink";
import Loader from "../views/Loader";
import EventRow from "../views/EventRow";

import "../../css/components/views/EventsBrowser.scss";

class EventsBrowser extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      resultsPerPage: 20,
      filtersOpen: false,
      selectedEventOutput: "",
      hasFilters: false,
      // If there are already results to show either it's page 1 or they will
      // be replaced by the componentDidMount empty query results.
      pageCursors: props.currentResults.totalResultCount ? [""] : [],
    };
  }

  /*
   * For every page of results save the cursor used to obtain that page so we
   * can return to it later. The last item in pageCursors is the cursor to obtain the current page.
   * After processing the first page of events, pageCursors is [""].
   */
  onEventsChange(current, next) {
    // Page 1 of a new query
    if (next.sourceQuery.cursor === "") {
      this.setState({ pageCursors: [""] });
      return;
    }
    // Next page of current query
    if (next.sourceQuery.cursor === current.cursor) {
      this.setState({ pageCursors: this.state.pageCursors.concat(next.sourceQuery.cursor) });
      return;
    }
    // Previous page of current query
    const pageIndex = this.state.pageCursors.indexOf(next.sourceQuery.cursor);
    if (pageIndex >= 0) {
      this.setState({ pageCursors: this.state.pageCursors.slice(0, pageIndex + 1) });
      return;
    }
    // Recover from unexpected state
    this.submitQuery(next.sourceQuery.search_text, "");
  }

  currentPage() {
    return this.state.pageCursors.length - 1;
  }

  pageCount() {
    return Math.ceil(this.props.currentResults.totalResultCount / this.state.resultsPerPage);
  }

  offset() {
    return this.currentPage() * this.state.resultsPerPage;
  }

  componentDidMount() {
    this.submitQuery("", "");
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentResults !== nextProps.currentResults) {
      this.onEventsChange(this.props.currentResults, nextProps.currentResults);
    }
  }

  search(query) {
    this.submitQuery(query, "");
  }

  submitQuery(query, cursor) {
    // const projId = this.props.match.params.projectId;
    // const envId = this.props.match.params.environmentId;
    const projId = "df34f3aa23d84afebbe86cba806f34fa";
    const envId = "b6c633691c6449eb93abd995d8536c17";
    const queryObj = {
      search_text: query,
      cursor,
      length: this.state.resultsPerPage,
    };

    this.props.requestEventSearch(projId, envId, queryObj);
  }

  nextPage() {
    this.submitQuery(
      this.props.currentResults.sourceQuery.search_text,
      this.props.currentResults.cursor,
    );
  }

  prevPage() {
    this.submitQuery(
      this.props.currentResults.sourceQuery.search_text,
      this.state.pageCursors[this.currentPage() - 1],
    );
  }

  render() {
    const {
      events,
      currentResults,
      tableHeaderItems
    } = this.props;

    const isMobile = false;
    const renderers = {
      "Link": InlineLink,
    };
    return (
      <div className={`LogsViewer-wrapper u-minHeight--full u-width--full flex-column flex1 ${this.props.theme}`}>
        <div className="u-minHeight--full u-width--full u-overflow--hidden flex-column flex1">
          <div className="flex1 flex-column">
            <div className="EventsTable-header flex flex-auto">
              <h3 className="flex-1-auto u-lineHeight--more u-fontSize--header3">Events</h3>
              <span className="flex flex-auto justifyContent--flexEnd">
                <input type="text" className="Input" />
              </span>
            </div>
            <div className="flex flex-auto">
              <FixedTableHeader
                items={tableHeaderItems}
              />
            </div>
            {this.props.dataLoading.eventFetchLoading ?
              <div className="flex-column flex1 justifyContent--center alignItems--center">
                <Loader size="70" color={this.props.theme === "dark" ? "#ffffff" : "#337AB7"} />
              </div>
              :
              <div className="flex-column flex-1-auto u-overflow--auto">
                {currentResults.resultIds.length ?
                  currentResults.resultIds.map((eid, i) => (
                    <EventRow
                      key={eid}
                      event={events[eid]}
                      renderers={renderers}
                      isMobile={isMobile}
                      index={i}
                      outputHovered={this.state[`output-${eid}Hovered`]}
                      displayTooltip={() => { return; }}
                      openModal={() => { return; }}
                    />
                  ))
                  : currentResults.sourceQuery.search_text !== "" ?
                    <div className="flex1 flex-column u-marginTop--more u-textAlign--center justifyContent--center alignItems--center">
                      <p className="u-margin--none u-paddingTop--normal u-paddingBottom--normal u-fontWeight--medium u-color--dustyGray u-fontSize--large">The query<code className="u-marginLeft--small u-marginRight--small">{currentResults.sourceQuery.search_text}</code>found no results</p>
                      <p className="u-marginTop--more u-fontWeight--medium u-color--dustyGray u-fontSize--large">
                        Try <span className="u-color--curiousBlue u-textDecoration--underlineOnHover" onClick={this.toggleFitlerDropdown}>adjusting your filters</span> or changing your keyword terms
                  </p>
                    </div>
                    :
                    <div className="u-marginTop--more u-textAlign--center flex1 flex-column alignItems--center justifyContent--center">
                      <div className="flex-auto">
                        <div className="icon u-eventsEmptyIcon u-marginBottom--normal"></div>
                        <p className="u-margin--none u-paddingTop--normal u-paddingBottom--more u-fontWeight--medium u-color--dustyGray u-fontSize--large">No events found</p>
                      </div>
                    </div>
                }
              </div>
            }
            <div className={`flex flex-auto EventPager ${!currentResults.resultIds.length || (currentResults.resultIds.length < this.state.resultsPerPage) ? "" : "has-shadow"}`}>
              <div className={`flex arrow-wrapper justifyContent--flexEnd ${isMobile ? "flex-auto u-paddingLeft--more" : "flex1"}`}>
                {this.currentPage() > 0 ?
                  <p
                    className="u-fontSize--normal u-color--dustyGray u-fontWeight--medium u-lineHeight--normal u-cursor--pointer u-display--inlineBlock"
                    onClick={this.prevPage}
                  >
                    <span className="icon clickable u-dropdownArrowIcon previous"></span> Newer
                </p>
                  : null}
              </div>
              <div className="flex1">
                {currentResults.resultIds.length
                  ? <p className="u-fontSize--normal u-fontWeight--medium u-lineHeight--normal u-textAlign--center">
                    <span className="u-color--dustyGray">Showing events </span>
                    <span className="u-color-tuna">{`${this.offset() + 1} - ${this.offset() + currentResults.resultIds.length}`}</span>
                    <span className="u-color--dustyGray"> of </span>
                    <span className="u-color-tuna">{currentResults.totalResultCount}</span>
                  </p>
                  : null}
              </div>
              <div className={`flex arrow-wrapper justifyContent--flexStart ${isMobile ? "flex-auto u-paddingRight--more" : "flex1"}`}>
                {this.currentPage() < (this.pageCount() - 1) ?
                  <p
                    className="u-fontSize--normal u-color--dustyGray u-fontWeight--medium u-lineHeight--normal u-cursor--pointer u-display--inlineBlock"
                    onClick={this.nextPage}
                  >
                    Older <span className="icon clickable u-dropdownArrowIcon next"></span>
                  </p>
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    events: state.data.eventsData.byId,
    currentResults: state.data.eventsData.latestServerResults,
    dataLoading: state.ui.loadingData,
    tableHeaderItems: state.ui.eventsUiData.eventTableHeaderItems,
  }),
  dispatch => ({
    requestEventSearch(projectId, environmentId, query) {
      return dispatch(requestEventSearch(projectId, environmentId, query));
    },
  }),
)(EventsBrowser);
