/* eslint-disable max-statements */
/* eslint-disable complexity */
import { useState, useEffect, FC, useRef } from "react";
import { connect } from "react-redux";
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
  cursor?: string;
  searchText?: string;
};

const EventsBrowser: FC<EventBrowserProps> = (props) => {
  const { events, currentResults, breakpoint } = props;
  const previousCurrentResults = useRef(props.currentResults);

  let { tableHeaderItems } = props;

  const resultsPerPage = 20;
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [pageCursors, setPageCursors] = useState(props.currentResults.totalResultCount ? [""] : []);
  const [activeModal, setActiveModal] = useState({ modal: null, name: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [crudFilters, setCrudFilters] = useState({
    cChecked: true,
    rChecked: false,
    uChecked: true,
    dChecked: true,
  });
  const [dateFilters, setDateFilters] = useState(null);
  const [tokenTooltip, setTokenTooltip] = useState(false);
  const [exportTooltip, setExportTooltip] = useState(false);

  // Effect to create session on mount
  useEffect(() => {
    props.createSession(props.auditLogToken, props.host);

    return () => {
      props.clearSession();
    };
  }, []);

  // Effect to handle session updates
  useEffect(() => {
    if (props.session.token) {
      submitQuery(props.searchText ?? "crud:c,u,d", props.cursor ?? "");
    }
  }, [props.session.token]);

  // Effect to handle audit log token changes
  useEffect(() => {
    if (props.auditLogToken) {
      props.createSession(props.auditLogToken, props.host);
    }
  }, [props.auditLogToken]);

  const onEventsChange = (current, next) => {
    // Page 1 of a new query
    if (next.sourceQuery.cursor === "") {
      setPageCursors([""]);
      return;
    }
    // Next page of current query
    if (next.sourceQuery.cursor === current.cursor) {
      setPageCursors((prev) => [...prev, next.sourceQuery.cursor]);
      return;
    }
    // Previous page of current query
    const pageIndex = pageCursors.indexOf(next.sourceQuery.cursor);
    if (pageIndex >= 0) {
      setPageCursors((prev) => prev.slice(0, pageIndex + 1));
      return;
    }
    // Recover from unexpected state
    submitQuery(next.sourceQuery.search_text, "");
  };

  useEffect(() => {
    if (props.currentResults !== previousCurrentResults.current) {
      onEventsChange(previousCurrentResults.current, currentResults);
    }
    previousCurrentResults.current = props.currentResults;
  }, [props.currentResults]);

  const currentPage = () => {
    return pageCursors.length - 1;
  };

  const pageCount = () => {
    return Math.ceil(props.currentResults.totalResultCount / resultsPerPage);
  };

  const offset = () => {
    let op = currentPage() * resultsPerPage;
    return op;
  };

  const handleRefreshToken = () => {
    if (typeof props.refreshToken === "function") {
      props.refreshToken();
    }
  };

  const search = (query, filters, dates) => {
    setSearchQuery(query);
    setCrudFilters(filters);
    setDateFilters(dates);
    submitQuery(query, "");
  };

  const submitQuery = (query, cursor) => {
    const queryObj = {
      search_text: query,
      cursor,

      length: resultsPerPage,

      skipViewLogEvent: props.skipViewLogEvent,
    };
    props.requestEventSearch(queryObj, handleRefreshToken);
  };

  const nextPage = () => {
    submitQuery(props.currentResults.sourceQuery.search_text, props.currentResults.cursor);
  };

  const prevPage = () => {
    submitQuery(props.currentResults.sourceQuery.search_text, pageCursors[currentPage() - 1]);
  };

  const toggleFilterDropdown = () => {
    setFiltersOpen(!filtersOpen);
  };

  const renderModal = (modal, name) => {
    setIsModalOpen(true);
    setActiveModal({
      modal,
      name,
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveModal({
      modal: null,
      name: "",
    });
  };

  /**
   *
   * @param info field object
   * @returns processed field object
   *
   * Add default style parameters to field object if not provided
   * In case of well known fields add getValue to get the correct values to display
   */
  const processField = (info) => {
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
  };

  /**
   *
   * @param fields Array of field object
   * @returns cleaned up Array of fields
   *
   * Filters invalid fields & add show event field if disableShowRawEvent flag is not set
   */
  const processFields = (fields) => {
    // filter fields which can not be rendered
    fields = fields.filter((f) =>
      !Array.isArray(f) && typeof f === "object" ? f.type !== "showEvent" : false
    );

    return props.disableShowRawEvent
      ? fields.map((f) => {
          return processField(f);
        })
      : [
          ...fields.map((f) => {
            return processField(f);
          }),
          {
            type: "showEvent",
            label: "",
            style: { maxWidth: "20px" },
            className: "flex1",
          },
        ];
  };

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

  tableHeaderItems = processFields(props.fields.length > 0 ? props.fields : tableHeaderItems);

  return props.mount ? (
    <div className="LogsViewer-wrapper u-minHeight--full u-width--full flex-column flex1">
      <div className="u-minHeight--full u-width--full u-overflow--hidden flex-column flex1">
        <div className="flex1 flex-column u-minHeight--full">
          <div className="EventsTable-header flex flex-auto flexWrap--wrap">
            <div className="flex-1-auto flex">
              <h1 data-testid="headerTitle" className="flex-auto u-lineHeight--more u-fontSize--header3">
                {props.headerTitle}
              </h1>
              <span className="flex flex-auto u-marginLeft--more">
                <SearchForm
                  onSubmit={search}
                  text={searchText}
                  filtersOpen={filtersOpen}
                  toggleDropdown={toggleFilterDropdown}
                  searchHelpURL={props.searchHelpURL}
                />
              </span>
            </div>
            <div className="flex flex-auto icons">
              <div className="flex-auto flex-column flex-verticalCenter">
                <span
                  className="icon clickable u-csvExportIcon"
                  data-testid={`export-events`}
                  onClick={() => {
                    renderModal(
                      <ExportEventsModal
                        searchInputQuery={searchQuery}
                        crudFilters={crudFilters}
                        dateFilters={dateFilters}
                      />,
                      "ExportEventsModal"
                    );
                  }}
                  onMouseEnter={() => {
                    setExportTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setExportTooltip(false);
                  }}>
                  <Tooltip
                    visible={exportTooltip}
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
                    renderModal(
                      <AccessTokensModal apiTokenHelpURL={props.apiTokenHelpURL} />,
                      "AccessTokensModal"
                    );
                  }}
                  onMouseEnter={() => {
                    setTokenTooltip(true);
                  }}
                  onMouseLeave={() => {
                    setTokenTooltip(false);
                  }}>
                  <Tooltip
                    visible={tokenTooltip}
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
          {props.dataLoading.eventFetchLoading ? (
            <div className="flex-column flex1 justifyContent--center alignItems--center">
              <Loader size="70" color={props.theme === "dark" ? "#ffffff" : "#337AB7"} />
            </div>
          ) : (
            <div className="EventsWrapper flex-column flex-1-auto u-overflow--auto">
              {currentResults.resultIds.length ? (
                currentResults.resultIds.map((eid, i) =>
                  !isMobileEvents ? (
                    <EventRow
                      key={`${eid}-${i}`}
                      event={events[eid]}
                      fields={props.fields && tableHeaderItems}
                      renderers={renderers}
                      openModal={() => {
                        const _event = { ...events[eid] };
                        delete _event.display;
                        delete _event.raw;
                        renderModal(<EventModal event={_event} />, "EventModal");
                      }}
                    />
                  ) : (
                    <MobileEventRow
                      key={`${eid}-${i}`}
                      event={events[eid]}
                      renderers={renderers}
                      index={i}
                      openModal={() => {
                        const _event = { ...events[eid] };
                        delete _event.display;
                        delete _event.raw;
                        renderModal(<EventModal event={_event} />, "EventModalMobile");
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
                      onClick={toggleFilterDropdown}>
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
              !currentResults.resultIds.length || currentResults.resultIds.length < resultsPerPage
                ? ""
                : "has-shadow"
            }`}>
            <div
              className={`flex arrow-wrapper justifyContent--flexEnd ${
                isMobile ? "flex-auto u-paddingLeft--more" : "flex1"
              }`}>
              {currentPage() > 0 ? (
                <p
                  className="u-fontSize--normal u-color--dustyGray u-fontWeight--medium u-lineHeight--normal u-cursor--pointer u-display--inlineBlock"
                  onClick={!props.dataLoading.eventFetchLoading ? prevPage : null}>
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
                  <span className="u-color-tuna u-fontWeight--medium">{`${offset() + 1} - ${
                    offset() + currentResults.resultIds.length
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
              {currentPage() < pageCount() - 1 ? (
                <p
                  className="u-fontSize--normal u-color--dustyGray u-fontWeight--medium u-lineHeight--normal u-cursor--pointer u-display--inlineBlock"
                  onClick={!props.dataLoading.eventFetchLoading ? nextPage : null}>
                  Older <span className="icon clickable u-dropdownArrowIcon next"></span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <ModalPortal
        isOpen={isModalOpen}
        name={activeModal.name}
        closeModal={() => {
          closeModal();
        }}
        content={activeModal.modal}
      />
    </div>
  ) : null;
};

export default connect(
  (state: any) => ({
    session: state.data.sessionData.session,
    events: state.data.eventsData.byId,
    currentResults: state.data.eventsData.latestServerResults,
    dataLoading: state.ui.loadingData,
    tableHeaderItems: state.ui.eventsUiData.eventTableHeaderItems,
    cursor: state.ui.eventsUiData.cursor,
    searchText: state.ui.eventsUiData.searchText,
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
)(Resizer(BreakpointConfig)(EventsBrowser));
