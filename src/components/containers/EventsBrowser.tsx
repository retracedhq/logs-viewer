import React from "react";
import { connect } from "react-redux";
import autobind from "react-autobind";
import _ from "lodash";

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
import EventModal from "../modals/EventModal";
import Tooltip from "../shared/Tooltip";

import "../../css/components/views/EventsBrowser.scss";

import { Resizer } from "./wrappers/Resize";
import { BreakpointConfig } from "../../services/breakpoints";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export type EventBrowserProps = {
  auditLogToken: string;
  mount?: boolean;
  headerTitle?: string;
  host?: string;
  apiTokenHelpURL?: string;
  searchHelpURL?: string;
  fields?: any[];
  disableShowRawEvent?: boolean;
  skipViewLogEvent?: boolean;
  currentResults?: any;
  createSession?: any;
  session?: any;
  clearSession?: any;
  requestEventSearch?: any;
  events?: any;
  breakpoint?: string;
  tableHeaderItems?: any;
  theme?: string;
  dataLoading?: any;
  refreshToken?: () => void;
  toggleDisplay?: {
    fields?: boolean;
    metadata?: boolean;
  };
  cursor: string;
};

interface EventBrowserState {
  resultsPerPage: number;
  filtersOpen: boolean;
  selectedEventOutput: string;
  hasFilters: boolean;
  pageCursors: string[];
  activeModal: {
    modal: any;
    name: string;
  };
  isModalOpen: boolean;
  searchQuery: string;
  crudFilters: {
    cChecked: boolean;
    rChecked: boolean;
    uChecked: boolean;
    dChecked: boolean;
  };
  dateFilters: {
    receivedStartDate: string;
    receivedEndDate: string;
  };
  tokenTooltip: boolean;
  exportTooltip: boolean;
}

@Resizer(BreakpointConfig)
class EventsBrowser extends React.Component<EventBrowserProps, EventBrowserState> {
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
      this.setState({
        pageCursors: this.state.pageCursors.concat(next.sourceQuery.cursor),
      });
      return;
    }
    // Previous page of current query

    const pageIndex = this.state.pageCursors.indexOf(next.sourceQuery.cursor);
    if (pageIndex >= 0) {
      this.setState({
        pageCursors: this.state.pageCursors.slice(0, pageIndex + 1),
      });
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
    this.props.createSession(this.props.auditLogToken, this.props.host);
    // this.submitQuery("crud:c,u,d", "");
  }

  componentDidUpdate(prevProps: Readonly<EventBrowserProps>) {
    if (this.props.session.token !== prevProps.session.token) {
      this.submitQuery(
        this.props.currentResults.sourceQuery.search_text ?? "crud:c,u,d",
        this.props.cursor ?? ""
      );
    }
  }

  handleRefreshToken() {
    if (typeof this.props.refreshToken === "function") {
      this.props.refreshToken();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.currentResults !== nextProps.currentResults) {
      this.onEventsChange(this.props.currentResults, nextProps.currentResults);
    }
  }

  UNSAFE_componentWillUpdate(nextProps) {
    // If we have a new token, we need to create a new session

    if (this.props.auditLogToken !== nextProps.auditLogToken) {
      this.props.createSession(nextProps.auditLogToken, this.props.host);
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
      dateFilters: dates,
    });
    this.submitQuery(query, "");
  }

  submitQuery(query, cursor) {
    const queryObj = {
      search_text: query,
      cursor,

      length: this.state.resultsPerPage,

      skipViewLogEvent: this.props.skipViewLogEvent,
    };
    this.props.requestEventSearch(queryObj, this.handleRefreshToken);
  }

  nextPage() {
    this.submitQuery(this.props.currentResults.sourceQuery.search_text, this.props.currentResults.cursor);
  }

  prevPage() {
    this.submitQuery(
      this.props.currentResults.sourceQuery.search_text,

      this.state.pageCursors[this.currentPage() - 1]
    );
  }

  determineIfFilters(filters) {
    if (!filters) {
      return false;
    }
    if (filters.receivedStartDate || filters.receivedEndDate) {
      return true;
    }
    if (filters.searchQuery.length > 0 || filters.crudFilters.length > 0) {
      return true;
    }
    if (filters.cChecked || filters.rChecked || filters.uChecked || filters.dChecked) {
      return true;
    }
    return false;
  }

  hasFilters(filters) {
    this.setState({
      hasFilters: this.determineIfFilters(filters),
    });
  }

  toggleFilterDropdown() {
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
    });
  }

  /**
   *
   * @param info field object
   * @returns processed field object
   *
   * Add default style parameters to field object if not provided
   * In case of well known fields add getValue to get the correct values to display
   */
  processField(info) {
    if (info.type === "markdown") {
      info = {
        ...info,
        style: info.style || { maxWidth: "none" },
        className: info.className || "flex-1-auto",
      };
    } else {
      info = {
        ...info,
        style: info.style || { maxWidth: "180px" },
        className: info.className || "flex1",
      };
    }
    if (info.getValue) {
      return info;
    }
    switch (info.field) {
      case "canonical_time":
        info.getValue = (event) => {
          return dayjs(event.canonical_time).fromNow();
        };
        return info;
      case "actor":
      case "actor.id":
      case "actor.name":
        info.getValue = (event) => {
          return event.actor.name || event.actor.id;
        };
        return info;
      case "group":
      case "group.id":
      case "group.name":
        info.getValue = (event) => {
          return event.group.name || event.group.id;
        };
        return info;
      case "target":
      case "target.id":
      case "target.name":
      case "target.type":
        info.getValue = (event) => {
          return event.target.name || event.target.id || event.target.type;
        };
        return info;
      default:
        return info;
    }
  }

  /**
   *
   * @param fields Array of field object
   * @returns cleaned up Array of fields
   *
   * Filters invalid fields & add show event field if disableShowRawEvent flag is not set
   */
  processFields(fields) {
    // filter fields which can not be rendered
    fields = fields.filter((f) =>
      !Array.isArray(f) && typeof f === "object" ? f.type !== "showEvent" : false
    );

    return this.props.disableShowRawEvent
      ? fields.map((f) => {
          return this.processField(f);
        })
      : [
          ...fields.map((f) => {
            return this.processField(f);
          }),
          {
            type: "showEvent",
            label: "",
            style: { maxWidth: "20px" },
            className: "flex1",
          },
        ];
  }

  render() {
    const { events, currentResults, breakpoint } = this.props;

    let { tableHeaderItems } = this.props;
    tableHeaderItems = this.processFields(
      this.props.fields.length > 0 ? this.props.fields : tableHeaderItems
    );

    // regex: strips " crud:*" from search text displayed in search box
    const searchText =
      (!_.isEmpty(currentResults.sourceQuery.search_text) &&
        currentResults.sourceQuery.search_text.replace(/\s?crud:([crud],?)+/g, "")) ||
      "";

    const isMobile = breakpoint === "mobile";
    const isMobileEvents = breakpoint === "mobileEvents";
    const renderers = {
      Link: InlineLink,
    };

    return this.props.mount ? (
      <div className="LogsViewer-wrapper u-minHeight--full u-width--full flex-column flex1">
        <div className="u-minHeight--full u-width--full u-overflow--hidden flex-column flex1">
          <div className="flex1 flex-column u-minHeight--full">
            <div className="EventsTable-header flex flex-auto flexWrap--wrap">
              <div className="flex-1-auto flex">
                <h1 data-testid="headerTitle" className="flex-auto u-lineHeight--more u-fontSize--header3">
                  {this.props.headerTitle}
                </h1>
                <span className="flex flex-auto u-marginLeft--more">
                  <SearchForm
                    onSubmit={this.search}
                    text={searchText}
                    filtersOpen={this.state.filtersOpen}
                    toggleDropdown={this.toggleFilterDropdown}
                    hasFilters={this.hasFilters}
                    searchHelpURL={this.props.searchHelpURL}
                  />
                </span>
              </div>
              <div className="flex flex-auto icons">
                <div className="flex-auto flex-column flex-verticalCenter">
                  <span
                    className="icon clickable u-csvExportIcon"
                    data-testid={`export-events`}
                    onClick={() => {
                      this.renderModal(
                        <ExportEventsModal
                          searchInputQuery={this.state.searchQuery}
                          crudFilters={this.state.crudFilters}
                          dateFilters={this.state.dateFilters}
                        />,
                        "ExportEventsModal"
                      );
                    }}
                    onMouseEnter={() => {
                      this.setState({ exportTooltip: true });
                    }}
                    onMouseLeave={() => {
                      this.setState({ exportTooltip: false });
                    }}>
                    <Tooltip
                      visible={this.state.exportTooltip}
                      text="Export Events"
                      minWidth="120"
                      position="bottom-left"
                    />
                  </span>
                </div>
                <div className="u-marginLeft--more flex-auto flex-column flex-verticalCenter">
                  <span
                    className="icon clickable u-tokensIcon"
                    data-testid={`manage-api-tokens`}
                    onClick={() => {
                      this.renderModal(
                        <AccessTokensModal
                          apiTokenHelpURL={this.props.apiTokenHelpURL}
                          closeModal={this.closeModal}
                        />,
                        "AccessTokensModal"
                      );
                    }}
                    onMouseEnter={() => {
                      this.setState({ tokenTooltip: true });
                    }}
                    onMouseLeave={() => {
                      this.setState({ tokenTooltip: false });
                    }}>
                    <Tooltip
                      visible={this.state.tokenTooltip}
                      text="Manage API Tokens"
                      minWidth="150"
                      position="bottom-left"
                    />
                  </span>
                </div>
              </div>
            </div>
            {!isMobileEvents ? (
              <div className="flex flex-auto">
                <FixedTableHeader items={tableHeaderItems} />
              </div>
            ) : null}
            {this.props.dataLoading.eventFetchLoading ? (
              <div className="flex-column flex1 justifyContent--center alignItems--center">
                <Loader size="70" color={this.props.theme === "dark" ? "#ffffff" : "#337AB7"} />
              </div>
            ) : (
              <div className="EventsWrapper flex-column flex-1-auto u-overflow--auto">
                {currentResults.resultIds.length ? (
                  currentResults.resultIds.map((eid, i) =>
                    !isMobileEvents ? (
                      <EventRow
                        tableHeaderItems={tableHeaderItems}
                        key={`${eid}-${i}`}
                        event={events[eid]}
                        fields={this.props.fields && tableHeaderItems}
                        renderers={renderers}
                        isMobile={isMobileEvents}
                        index={i}
                        outputHovered={this.state[`output-${eid}Hovered`]}
                        displayTooltip={() => {
                          return;
                        }}
                        openModal={() => {
                          const _event = { ...events[eid] };
                          delete _event.display;
                          delete _event.raw;
                          this.renderModal(<EventModal event={_event} />, "EventModal");
                        }}
                      />
                    ) : (
                      <MobileEventRow
                        key={`${eid}-${i}`}
                        event={events[eid]}
                        tableHeadersItems={tableHeaderItems}
                        renderers={renderers}
                        isMobile={isMobileEvents}
                        index={i}
                        outputHovered={this.state[`output-${eid}Hovered`]}
                        displayTooltip={() => {
                          return;
                        }}
                        openModal={() => {
                          const _event = { ...events[eid] };
                          delete _event.display;
                          delete _event.raw;
                          this.renderModal(<EventModal event={_event} />, "EventModalMobile");
                        }}
                      />
                    )
                  )
                ) : currentResults.sourceQuery.search_text !== "" ? (
                  <div className="flex1 flex-column u-marginTop--more u-textAlign--center justifyContent--center alignItems--center">
                    <p
                      className="u-margin--none u-paddingTop--normal u-paddingBottom--normal u-fontWeight--medium u-color--dustyGray u-fontSize--large flex alignItems--center"
                      style={{ gap: "4px" }}>
                      The query
                      {currentResults.sourceQuery.search_text ? (
                        <code>{currentResults.sourceQuery.search_text || "crud:c,u,d"}</code>
                      ) : (
                        ` "" `
                      )}
                      found no results
                    </p>
                    <p className="u-marginTop--more u-fontWeight--medium u-color--dustyGray u-fontSize--large">
                      Try{" "}
                      <span
                        className="u-color--curiousBlue u-textDecoration--underlineOnHover"
                        onClick={this.toggleFilterDropdown}>
                        adjusting your filters
                      </span>{" "}
                      or changing your keyword terms
                    </p>
                  </div>
                ) : (
                  <div className="u-marginTop--more u-textAlign--center flex1 flex-column alignItems--center justifyContent--center">
                    <div className="flex-auto">
                      <div className="icon u-eventsEmptyIcon u-marginBottom--normal"></div>
                      <p className="u-margin--none u-paddingTop--normal u-paddingBottom--more u-fontWeight--medium u-color--dustyGray u-fontSize--large">
                        No events found
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div
              className={`flex flex-auto EventPager ${
                !currentResults.resultIds.length ||
                currentResults.resultIds.length < this.state.resultsPerPage
                  ? ""
                  : "has-shadow"
              }`}>
              <div
                className={`flex arrow-wrapper justifyContent--flexEnd ${
                  isMobile ? "flex-auto u-paddingLeft--more" : "flex1"
                }`}>
                {this.currentPage() > 0 ? (
                  <p
                    className="u-fontSize--normal u-color--dustyGray u-fontWeight--medium u-lineHeight--normal u-cursor--pointer u-display--inlineBlock"
                    onClick={!this.props.dataLoading.eventFetchLoading ? this.prevPage : null}>
                    <span className="icon clickable u-dropdownArrowIcon previous"></span> Newer
                  </p>
                ) : null}
              </div>
              <div className="flex1 resultsCount">
                {currentResults.resultIds.length ? (
                  <p className="u-fontSize--normal u-lineHeight--normal u-textAlign--center">
                    <span data-testid="showing-events" className="u-color--dustyGray">
                      Showing events{" "}
                    </span>
                    <span className="u-color-tuna u-fontWeight--medium">{`${this.offset() + 1} - ${
                      this.offset() + currentResults.resultIds.length
                    }`}</span>
                    <span className="u-color--dustyGray"> of </span>
                    <span className="u-color-tuna u-fontWeight--medium">
                      {currentResults.totalResultCount.toLocaleString
                        ? currentResults.totalResultCount.toLocaleString()
                        : currentResults.totalResultCount}
                    </span>
                  </p>
                ) : null}
              </div>
              <div
                className={`flex arrow-wrapper justifyContent--flexStart ${
                  isMobile ? "flex-auto u-paddingRight--more" : "flex1"
                }`}>
                {this.currentPage() < this.pageCount() - 1 ? (
                  <p
                    className="u-fontSize--normal u-color--dustyGray u-fontWeight--medium u-lineHeight--normal u-cursor--pointer u-display--inlineBlock"
                    onClick={!this.props.dataLoading.eventFetchLoading ? this.nextPage : null}>
                    Older <span className="icon clickable u-dropdownArrowIcon next"></span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <ModalPortal
          isOpen={this.state.isModalOpen}
          name={this.state.activeModal.name}
          closeModal={() => {
            this.closeModal();
          }}
          content={this.state.activeModal.modal}
          ariaHideApp={false}
        />
      </div>
    ) : null;
  }
}

export default connect(
  (state: any) => ({
    session: state.data.sessionData.session,
    events: state.data.eventsData.byId,
    currentResults: state.data.eventsData.latestServerResults,
    dataLoading: state.ui.loadingData,
    tableHeaderItems: state.ui.eventsUiData.eventTableHeaderItems,
    cursor: state.ui.eventsUiData.cursor,
  }),
  (dispatch: any, ownProps: EventBrowserProps) => ({
    requestEventSearch(query, handleRefreshToken) {
      return dispatch(requestEventSearch(query, handleRefreshToken, ownProps.toggleDisplay));
    },
    createSession(token, host) {
      return dispatch(createSession(token, host));
    },
    clearSession() {
      return dispatch(clearSession());
    },
  })
)(EventsBrowser);
