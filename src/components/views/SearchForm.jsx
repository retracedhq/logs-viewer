import React from "react";
import autoBind from "react-autobind";
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

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.dateFormatString = getDateFormatString();
  }

  onChange = (e) => {
    this.setState({
      searchQuery: e.target.value,
      isDefault: false,
    });
  };

  handleCrudFilterChange(field, e) {
    let newCrudFilters = this.state.crudFiltersArray;
    if (!newCrudFilters.includes(field)) {
      newCrudFilters.push(field);
    } else {
      const index = newCrudFilters.indexOf(field);
      if (index > -1) {
        newCrudFilters.splice(index, 1);
      }
    }
    this.setState({
      crudFiltersArray: newCrudFilters,
      crudFilters: {
        ...this.state.crudFilters,
        [`${field}Checked`]: e.target.checked,
      },
      isDefault: false,
    });
  }

  handleReceivedStartDateChange(date) {
    this.setState({
      receivedStartDate: date,
      isDefault: false,
    });
  }

  handleReceivedEndDateChange(date) {
    this.setState({
      receivedEndDate: date,
      isDefault: false,
    });
  }

  setInitialState() {
    this.setState({
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
    });
  }

  componentDidMount() {
    this.setInitialState();
    this.props.hasFilters(this.state);
  }

  componentDidUpdate(lastProps) {
    if (this.props.text !== lastProps.text) {
      this.props.hasFilters(this.state);
    }
  }

  // The API requires a start and end date in ISO8601 format.
  // Add 24 hours to end date to include that date.
  dateRangeWithDefaults(start, end) {
    return [
      start ? dayjs(start).format() : "2017-01-01T00:00:00Z",
      end ? dayjs(end).add(1, "d").format() : dayjs().add(1, "d").startOf("day").format(),
    ];
  }

  onSubmit = (e) => {
    e.preventDefault();
    const crudQuery = this.state.crudFiltersArray.length ? `crud:${this.state.crudFiltersArray.join()}` : "";
    const crudFilters = this.state.crudFilters;
    const dates = {
      startDate: this.state.receivedStartDate,
      endDate: this.state.receivedEndDate && dayjs(this.state.receivedEndDate).add(1, "d").toDate(),
    };
    const receivedQuery =
      !this.state.receivedStartDate && !this.state.receivedEndDate
        ? []
        : this.dateRangeWithDefaults(this.state.receivedStartDate, this.state.receivedEndDate);

    let query = `${this.state.searchQuery.length ? `${this.state.searchQuery} ` : ""}${crudQuery}${
      receivedQuery.length > 0 ? ` received:${receivedQuery.join()}` : ""
    }`;

    query = rewriteHumanTimes(query, "received");
    query = rewriteHumanTimes(query, "created");

    this.props.onSubmit(query, crudFilters, dates);
    if (this.props.filtersOpen) {
      this.props.toggleDropdown();
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div className="flex flex1">
            <div className="u-position--relative">
              <input
                type="text"
                data-testid={`search-events`}
                defaultValue={this.props.text}
                className="Input SearchEvents"
                onChange={this.onChange}
                placeholder="Search events"
                aria-label="Search events"
              />
              <span
                className="FilterDropdown-trigger u-textDecoration--underlineOnHover"
                onClick={this.props.toggleDropdown}>
                {this.props.filtersOpen ? "Close" : "Filters"}
              </span>
              {this.props.filtersOpen ? (
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
                          selected={this.state.receivedStartDate}
                          className="Input u-width--full"
                          placeholderText="Start"
                          dateFormat={this.dateFormatString}
                          popperModifiers={[
                            {
                              name: "offset",
                              options: {
                                offset: [-10, 0],
                              },
                            },
                          ]}
                          onChange={this.handleReceivedStartDateChange}
                        />
                      </div>
                      <div className="flex1 u-paddingLeft--small datepicker-style-boundary datepicker-specificity-hack">
                        <DatePicker
                          key="picker-end"
                          id="picker-end"
                          ariaLabelledBy="pickerEndLabel"
                          selected={this.state.receivedEndDate}
                          className="Input u-width--full"
                          placeholderText="End"
                          dateFormat={this.dateFormatString}
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
                          onChange={this.handleReceivedEndDateChange}
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
                        <div
                          className={`flex1 CustomCheckbox no-margin ${
                            this.state.cChecked ? "is-checked" : ""
                          }`}>
                          <div className="u-position--relative flex flex1">
                            <input
                              type="checkbox"
                              id="createEventType"
                              checked={this.state.crudFilters.cChecked}
                              value=""
                              onChange={(e) => {
                                this.handleCrudFilterChange("c", e);
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
                        <div
                          className={`flex1 CustomCheckbox no-margin ${
                            this.state.rChecked ? "is-checked" : ""
                          }`}>
                          <div className="u-position--relative flex flex1">
                            <input
                              type="checkbox"
                              id="readEventType"
                              checked={this.state.crudFilters.rChecked}
                              value=""
                              onChange={(e) => {
                                this.handleCrudFilterChange("r", e);
                              }}
                            />
                            <label
                              htmlFor="readEventType"
                              className="flex1 u-width--full u-position--relative">
                              Read
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex1">
                      <div className="flex1 u-paddingRight--small">
                        <div
                          className={`flex1 CustomCheckbox no-margin ${
                            this.state.uChecked ? "is-checked" : ""
                          }`}>
                          <div className="u-position--relative flex flex1">
                            <input
                              type="checkbox"
                              id="updateEventType"
                              checked={this.state.crudFilters.uChecked}
                              value=""
                              onChange={(e) => {
                                this.handleCrudFilterChange("u", e);
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
                        <div
                          className={`flex1 CustomCheckbox no-margin ${
                            this.state.dChecked ? "is-checked" : ""
                          }`}>
                          <div className="u-position--relative flex flex1">
                            <input
                              type="checkbox"
                              id="deleteEventType"
                              checked={this.state.crudFilters.dChecked}
                              value=""
                              onChange={(e) => {
                                this.handleCrudFilterChange("d", e);
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
                    {this.state.isDefault ? null : (
                      <button
                        type="button"
                        className="Button secondary gray small u-display--block u-width--full u-marginBottom--normal"
                        onClick={this.setInitialState}>
                        Reset filters
                      </button>
                    )}
                    <a
                      target="_blank"
                      href={this.props.searchHelpURL}
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
        {this.props.filtersOpen ? (
          <div className="hidden-trigger" onClick={this.props.toggleDropdown}></div>
        ) : null}
      </div>
    );
  }
}

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
