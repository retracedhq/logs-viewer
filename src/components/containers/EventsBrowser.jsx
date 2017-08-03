import * as React from "react";
import { connect } from "react-redux";
import * as autobind from "react-autobind";
import * as accounting from "accounting";
import { requestEventSearch } from "../../redux/data/events/thunks";
import { createSession } from "../../redux/data/session/thunks";
import { clearSession } from "../../redux/data/session/actions";
import FixedTableHeader from "../views/FixedTableHeader";
import InlineLink from "../views/InlineLink";
import Loader from "../views/Loader";
import EventRow from "../views/EventRow";
import MobileEventRow from "../views/MobileEventRow";
import SearchForm from "../views/SearchForm";
import ModalPortal from "../modals/ModalPortal";
import ExportEventsModal from "../modals/ExportEventsModal";
import AccessTokensModal from "../modals/AccessTokensModal";
import RawEventOutputModal from "../modals/RawEventOutputModal";
import Tooltip from "../shared/Tooltip";

import "../../css/components/views/EventsBrowser.scss";

import { Resizer } from "./wrappers/Resize";
import { BreakpointConfig } from "../../services/breakpoints";

@Resizer(BreakpointConfig)
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
      activeModal: {
        modal: null,
        name: "",
      },
      isModalOpen: false,
      searchQuery: "",
      crudFilters: {
        cChecked: true,
        rChecked: false,
        uChecked: true,
        dChecked: true,
      },
      dateFilters: null,
      tokenTooltip: false,
      exportTooltip: false,
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

  componentWillMount() {
    // Pass the audit log token and the preferred host (which will be stored in the state)
    this.props.createSession(this.props.auditLogToken, this.props.host);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentResults !== nextProps.currentResults) {
      this.onEventsChange(this.props.currentResults, nextProps.currentResults);
    }
  }

  componentWillUpdate(nextProps) {
    // If we have a new token, we need to create a new session
    if(this.props.auditLogToken != nextProps.auditLogToken) {
      this.props.createSession(nextProps.auditLogToken, this.props.host);
    }
    // If we have a new session, we need to request a new event search
    if(this.props.session.token != nextProps.session.token) {
      this.submitQuery("crud: c,u,d", "");
    }
  }

  componentWillUnmount() {
    // Clearing the store
    this.props.clearSession();
  } 

  search(query, filters, dates) {
    this.setState({ 
      searchQuery: query, 
      crudFilters: filters, 
      dateFilters: dates
    });
    this.submitQuery(query, "");
  }

  submitQuery(query, cursor) {
    const queryObj = {
      search_text: query,
      cursor,
      length: this.state.resultsPerPage,
    };
    this.props.requestEventSearch(queryObj);
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

  determineIfFilters(filters) {
    if (!filters) { return false; }
    if (filters.receivedStartDate || filters.receivedEndDate) { return true; };
    if (filters.searchQuery.length > 0 || filters.crudFilters.length > 0) { return true; };
    if (filters.cChecked || filters.rChecked || filters.uChecked || filters.dChecked) { return true; };
    return false;
  }

  hasFilters(filters) {
    this.setState({
      hasFilters: this.determineIfFilters(filters),
    });
  }

  toggleFitlerDropdown() {
    this.setState({
      filtersOpen: !this.state.filtersOpen,
    });
  }

  renderModal(modal, name) {
    this.setState({
      isModalOpen: true,
      activeModal: {
        modal,
        name,
      },
    });
  }

  closeModal() {
    this.setState({
      isModalOpen: false,
      activeModal: {
        modal: null,
        name: "",
      },
    })
  }

  render() {
    const {
      events,
      currentResults,
      exportResults,
      tableHeaderItems,
      breakpoint,
      apiTokens,
    } = this.props;
    const searchText = currentResults
      && currentResults.sourceQuery
      && currentResults.sourceQuery.search_text;
    const isMobile = breakpoint === "mobile";;
    const renderers = {
      "Link": InlineLink,
    };
    return (
      this.props.mount ? 
        <div className="LogsViewer-wrapper u-minHeight--full u-width--full flex-column flex1">
        <div className="u-minHeight--full u-width--full u-overflow--hidden flex-column flex1">
          <div className="flex1 flex-column u-minHeight--full">
            <div className="EventsTable-header flex flex-auto">
              <div className="flex-1-auto flex">
                <h3 className="flex-auto u-lineHeight--more u-fontSize--header3">{this.props.headerTitle}</h3>
                <span className="flex flex-auto u-marginLeft--more">
                  <SearchForm onSubmit={this.search} text={searchText} filtersOpen={this.state.filtersOpen} toggleDropdown={this.toggleFitlerDropdown} hasFilters={this.hasFilters} />
                </span>
              </div>
              <div className="flex flex-auto">
                <div className="flex-auto flex-column flex-verticalCenter">
                  <span className="icon clickable u-csvExportIcon" 
                    onClick={() => { this.renderModal(
                      <ExportEventsModal  
                        searchInputQuery={this.state.searchQuery} 
                        crudFilters={this.state.crudFilters} 
                        dateFilters={this.state.dateFilters} />, "ExportEventsModal") }}
                    onMouseEnter={() => {this.setState({ exportTooltip: true })}}
                    onMouseLeave={() => {this.setState({ exportTooltip: false })}}>
                    <Tooltip
                      visible={this.state.exportTooltip}
                      text="Export Events"
                      minWidth="120"
                      position="bottom-left"
                    />
                    </span>
                </div>
                <div className="u-marginLeft--more flex-auto flex-column flex-verticalCenter">
                  <span className="icon clickable u-tokensIcon" 
                    onClick={() => { this.renderModal(<AccessTokensModal closeModal={this.closeModal} />, "AccessTokensModal") }}
                    onMouseEnter={() => {this.setState({ tokenTooltip: true })}}
                    onMouseLeave={() => {this.setState({ tokenTooltip: false })}}>
                    <Tooltip
                      visible={this.state.tokenTooltip}
                      text="Manage Access Tokens"
                      minWidth="150"
                      position="bottom-left"
                    />
                    </span>
                </div>
              </div>
            </div>
            {!isMobile ?
              <div className="flex flex-auto">
                <FixedTableHeader
                  items={tableHeaderItems}
                />
              </div>
            : null}
            {this.props.dataLoading.eventFetchLoading ?
              <div className="flex-column flex1 justifyContent--center alignItems--center">
                <Loader size="70" color={this.props.theme === "dark" ? "#ffffff" : "#337AB7"} />
              </div>
              :
              <div className="flex-column flex-1-auto u-overflow--auto">
                {currentResults.resultIds.length ?
                  currentResults.resultIds.map((eid, i) => (
                    !isMobile ?
                      <EventRow
                        key={`${eid}-${i}`}
                        event={events[eid]}
                        renderers={renderers}
                        isMobile={isMobile}
                        index={i}
                        outputHovered={this.state[`output-${eid}Hovered`]}
                        displayTooltip={() => { return; }}
                        openModal={() => {
                          this.renderModal(
                            <RawEventOutputModal
                              rawOutput={events[eid].raw}
                            />
                          )
                        }}
                      />
                      :
                      <MobileEventRow
                        key={`${eid}-${i}`}
                        event={events[eid]}
                        renderers={renderers}
                        isMobile={isMobile}
                        index={i}
                        outputHovered={this.state[`output-${eid}Hovered`]}
                        displayTooltip={() => { return; }}
                        openModal={() => {
                          this.renderModal(
                            <RawEventOutputModal
                              rawOutput={events[eid].raw}
                            />
                          )
                        }}
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
                  ? <p className="u-fontSize--normal u-lineHeight--normal u-textAlign--center">
                    <span className="u-color--dustyGray">Showing events </span>
                    <span className="u-color-tuna u-fontWeight--medium">{`${this.offset() + 1} - ${this.offset() + currentResults.resultIds.length}`}</span>
                    <span className="u-color--dustyGray"> of </span>
                    <span className="u-color-tuna u-fontWeight--medium">{accounting.formatNumber(currentResults.totalResultCount)}</span>
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
        <ModalPortal 
          isOpen={this.state.isModalOpen} 
          name={this.state.activeModal.name} 
          closeModal={() => {this.closeModal()}} 
          content={this.state.activeModal.modal} />
      </div> : null
    );
  }
}

export default connect(
  state => ({
    session: state.data.sessionData.session,
    events: state.data.eventsData.byId,
    currentResults: state.data.eventsData.latestServerResults,
    dataLoading: state.ui.loadingData,
    tableHeaderItems: state.ui.eventsUiData.eventTableHeaderItems,
  }),
  dispatch => ({
    requestEventSearch(query) {
      return dispatch(requestEventSearch(query));
    },
    createSession(token, host) {
      return dispatch(createSession(token, host));
    },
    clearSession() {
      return dispatch(clearSession());
    },
  }),
)(EventsBrowser);