import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import searchQueryParser from "search-query-parser";
import _ from "lodash";
import DatePicker from "react-datepicker";

function getDateFormatString(lang = "default") {
  const formatObj = new Intl.DateTimeFormat(lang).formatToParts(new Date());

  return formatObj
    .map((obj) => {
      switch (obj.type) {
        case "day":
          return "dd";
        case "month":
          return "MM";
        case "year":
          return "yyyy";
        default:
          return obj.value;
      }
    })
    .join("");
}

const initialState = {
  query: "",
  receivedStartDate: null,
  receivedEndDate: null,
  searchQuery: "",
  crudFiltersArray: ["c", "u", "d"],
  crudFilters: {
    cChecked: true,
    rChecked: false,
    uChecked: true,
    dChecked: true,
  },
  isDefault: true,
};

const SearchForm = (props) => {
  const [state, setState] = useState(initialState);
  const dateFormatString = getDateFormatString();

  useEffect(() => {
    props.hasFilters(state);
  }, [state, props.hasFilters]);

  useEffect(() => {
    props.hasFilters(state);
  }, [props.text, state, props.hasFilters]);

  const setInitialState = () => {
    setState(initialState);
  };

  const onChange = (e) => {
    setState((prev) => ({
      ...prev,
      searchQuery: e.target.value,
      isDefault: false,
    }));
  };

  const handleCrudFilterChange = (field, e) => {
    setState((prev) => {
      const newCrudFilters = prev.crudFiltersArray.includes(field)
        ? prev.crudFiltersArray.filter((f) => f !== field)
        : [...prev.crudFiltersArray, field];

      return {
        ...prev,
        crudFiltersArray: newCrudFilters,
        crudFilters: {
          ...prev.crudFilters,
          [`${field}Checked`]: e.target.checked,
        },
        isDefault: false,
      };
    });
  };

  const handleReceivedStartDateChange = (date) => {
    setState((prev) => ({
      ...prev,
      receivedStartDate: date,
      isDefault: false,
    }));
  };

  const handleReceivedEndDateChange = (date) => {
    setState((prev) => ({
      ...prev,
      receivedEndDate: date,
      isDefault: false,
    }));
  };

  // The API requires a start and end date in ISO8601 format.
  // Add 24 hours to end date to include that date.
  const dateRangeWithDefaults = (start, end) => [
    start ? dayjs(start).format() : "2017-01-01T00:00:00Z",
    end ? dayjs(end).add(1, "d").format() : dayjs().add(1, "d").startOf("day").format(),
  ];

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const crudQuery = state.crudFiltersArray.length ? `crud:${state.crudFiltersArray.join()}` : "";

    const dates = {
      startDate: state.receivedStartDate,
      endDate: state.receivedEndDate && dayjs(state.receivedEndDate).add(1, "d").toDate(),
    };

    const receivedQuery =
      !state.receivedStartDate && !state.receivedEndDate
        ? []
        : dateRangeWithDefaults(state.receivedStartDate, state.receivedEndDate);

    let query = `${state.searchQuery.length ? `${state.searchQuery} ` : ""}${crudQuery}${
      receivedQuery.length > 0 ? ` received:${receivedQuery.join()}` : ""
    }`;

    // Assuming rewriteHumanTimes is defined elsewhere
    query = rewriteHumanTimes(query, "received");
    query = rewriteHumanTimes(query, "created");

    props.onSubmit(query, state.crudFilters, dates);

    if (props.filtersOpen) {
      props.toggleDropdown();
    }
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <div className="flex flex1">
          <div className="u-position--relative">
            <input
              type="text"
              data-testid={`search-events`}
              value={state.searchQuery}
              className="Input SearchEvents"
              onChange={onChange}
              placeholder="Search events"
              aria-label="Search events"
            />
            <span
              className="FilterDropdown-trigger u-textDecoration--underlineOnHover"
              onClick={props.toggleDropdown}>
              {props.filtersOpen ? "Close" : "Filters"}
            </span>
            {props.filtersOpen ? (
              <div className="FilterDropdown">
                <div className="u-paddingBottom--more">
                  <p
                    id="dateRangeLabel"
                    className="u-fontSize--normal u-fontWeight--medium u-color--tuna u-marginBottom--normal">
                    Date range
                  </p>
                  <div className="flex flex1">
                    <div className="flex1 u-paddingRight--small datepicker-style-boundary datepicker-specificity-hack">
                      <DatePicker
                        key="picker-start"
                        selected={state.receivedStartDate}
                        className="Input u-width--full"
                        placeholderText="Start"
                        dateFormat={dateFormatString}
                        popperModifiers={[
                          {
                            name: "offset",
                            options: {
                              offset: [-10, 0],
                            },
                          },
                        ]}
                        onChange={handleReceivedStartDateChange}
                      />
                    </div>
                    <div className="flex1 u-paddingLeft--small datepicker-style-boundary datepicker-specificity-hack">
                      <DatePicker
                        key="picker-end"
                        id="picker-end"
                        ariaLabelledBy="pickerEndLabel"
                        selected={state.receivedEndDate}
                        className="Input u-width--full"
                        placeholderText="End"
                        dateFormat={dateFormatString}
                        popoverAttachment="bottom center"
                        popoverTargetAttachment="top center"
                        popoverTargetOffset="10px 40px"
                        popperModifiers={[
                          {
                            name: "offset",
                            options: {
                              offset: [-10, 0],
                            },
                          },
                        ]}
                        onChange={handleReceivedEndDateChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="u-paddingBottom--more">
                  <p className="u-fontSize--normal u-fontWeight--medium u-color--tuna u-marginBottom--normal">
                    Event type
                  </p>
                  <div className="flex flex1 u-paddingBottom--normal">
                    <div className="flex1 u-paddingRight--small">
                      <div className={`flex1 CustomCheckbox no-margin ${state.cChecked ? "is-checked" : ""}`}>
                        <div className="u-position--relative flex flex1">
                          <input
                            type="checkbox"
                            id="createEventType"
                            checked={state.crudFilters.cChecked}
                            value=""
                            onChange={(e) => {
                              handleCrudFilterChange("c", e);
                            }}
                          />
                          <label
                            htmlFor="createEventType"
                            className="flex1 u-width--full u-position--relative">
                            Create
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex1 u-paddingLeft--small">
                      <div className={`flex1 CustomCheckbox no-margin ${state.rChecked ? "is-checked" : ""}`}>
                        <div className="u-position--relative flex flex1">
                          <input
                            type="checkbox"
                            id="readEventType"
                            checked={state.crudFilters.rChecked}
                            value=""
                            onChange={(e) => {
                              handleCrudFilterChange("r", e);
                            }}
                          />
                          <label htmlFor="readEventType" className="flex1 u-width--full u-position--relative">
                            Read
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex1">
                    <div className="flex1 u-paddingRight--small">
                      <div className={`flex1 CustomCheckbox no-margin ${state.uChecked ? "is-checked" : ""}`}>
                        <div className="u-position--relative flex flex1">
                          <input
                            type="checkbox"
                            id="updateEventType"
                            checked={state.crudFilters.uChecked}
                            value=""
                            onChange={(e) => {
                              handleCrudFilterChange("u", e);
                            }}
                          />
                          <label
                            htmlFor="updateEventType"
                            className="flex1 u-width--full u-position--relative">
                            Update
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex1 u-paddingLeft--small">
                      <div className={`flex1 CustomCheckbox no-margin ${state.dChecked ? "is-checked" : ""}`}>
                        <div className="u-position--relative flex flex1">
                          <input
                            type="checkbox"
                            id="deleteEventType"
                            checked={state.crudFilters.dChecked}
                            value=""
                            onChange={(e) => {
                              handleCrudFilterChange("d", e);
                            }}
                          />
                          <label
                            htmlFor="deleteEventType"
                            className="flex1 u-width--full u-position--relative">
                            Delete
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="u-textAlign--center">
                  {state.isDefault ? null : (
                    <button
                      type="button"
                      className="Button secondary gray small u-display--block u-width--full u-marginBottom--normal"
                      onClick={setInitialState}>
                      Reset filters
                    </button>
                  )}
                  <a
                    target="_blank"
                    href={props.searchHelpURL}
                    className="u-fontSize--small u-fontWeight--medium u-textDecoration--underlineOnHover helpLink">
                    Get help with search
                  </a>
                </div>
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            className="Button primary u-marginLeft--normal searchButton"
            data-testid={`search-button`}>
            Search
          </button>
        </div>
      </form>
      {props.filtersOpen ? <div className="hidden-trigger" onClick={props.toggleDropdown}></div> : null}
    </div>
  );
};

export default SearchForm;

/*
 * received:yesterday -> received:2017-04-18,2017-04-19
 * @param {string} query
 * @param {string} keyword
 * @return {string}
 */
function rewriteHumanTimes(query, keyword) {
  const parsed = searchQueryParser.parse(query, {
    keywords: [keyword],
  });
  const offset = _.find(parsed.offsets, (o) => o.keyword === keyword);

  if (!offset) {
    return query;
  }

  let range = `"${offset.value}"`;
  offset.value = offset.value.toLowerCase();

  if (/yesterday/.test(offset.value)) {
    range = daysAgoRange(1);
  }

  if (/^\d+\s*days?\s*ago$/.test(offset.value)) {
    range = daysAgoRange(parseInt(offset.value, 10));
  }

  if (/^[a-z]+\s*days?\s*ago$/.test(offset.value)) {
    const count = wordToInt(_.first(offset.value.match(/^[a-z]+/)));
    range = daysAgoRange(count);
  }

  if (/^\d+\s*hours?\s*ago$/.test(offset.value)) {
    range = hoursAgoRange(parseInt(offset.value, 10));
  }

  if (/^[a-z]+\s*hours?\s*ago$/.test(offset.value)) {
    const count = wordToInt(_.first(offset.value.match(/^[a-z]+/)));
    range = hoursAgoRange(count);
  }

  const prefix = query.substring(0, offset.offsetStart);
  const suffix = query.substring(offset.offsetEnd);

  return `${prefix} ${keyword}:${range} ${suffix}`;
}

/*
 * Example 2 -> "2017-04-18T00:00:00+7,2017-04-19T00:00+7"
 * @param {number} count
 * @return {string}
 */
function daysAgoRange(count) {
  const start = dayjs().subtract(count, "days").startOf("day");
  const end = start.clone().add(1, "day");

  return `${start.format()},${end.format()}`;
}

/*
 * @param {number} count
 * @return {string}
 */
function hoursAgoRange(count) {
  const start = dayjs().subtract(count, "hours").startOf("hour");
  const end = start.clone().add(1, "hour");

  return `${start.format()},${end.format()}`;
}

/*
 * Undocumented because it only supports low numbers. Official documentation
 * should show examples like "2 hours ago" rather than "two hours ago".
 * Example: "one" -> 1
 * @param {string} word
 * @return {number}
 */
function wordToInt(word) {
  return [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
  ].indexOf(word);
}
