import _ from "lodash";
import { receiveEventList } from "./actions";
import { loadingData } from "../../ui/actions";
import { storeCursor, storeSearchText } from "../../ui/events/actions";

function getObjFromKeyValArray(arr) {
  return arr?.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {});
}

export function requestEventSearch(query, refreshToken, toggleDisplay) {
  return async (dispatch, getState) => {
    dispatch(loadingData("eventFetch", true));
    let data;
    const skipViewLogEvent = query.skipViewLogEvent ? "?skipViewLogEvent=true" : "";
    const state = getState();
    const host = state.data.sessionData.host;
    const url = `${host}/graphql${skipViewLogEvent}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: state.data.sessionData.session.token,
        },
        body: JSON.stringify({
          query: `
            query Search($query: String!, $last: Int, $before: String) {
              search(query: $query, last: $last, before: $before) {
                totalCount
                pageInfo {
                  hasPreviousPage
                }
                edges {
                  cursor
                  node {
                    id
                    action
                    crud
                    created
                    received
                    canonical_time
                    description
                    actor {
                      id
                      name
                      href
                    }
                    group {
                      id
                      name
                    }
                    target {
                      id
                      name
                      href
                      type
                    }
                    display {
                      markdown
                    }
                    ${
                      toggleDisplay?.fields
                        ? `fields{
                      key
                      value
                    }`
                        : ""
                    }
                    ${
                      toggleDisplay?.metadata
                        ? `metadata{
                      key
                      value
                    }`
                        : ""
                    }
                    is_failure
                    is_anonymous
                    source_ip
                    country
                    loc_subdiv1
                    loc_subdiv2
                  }
                }
              }
            }
          `,
          variables: {
            query: query.search_text,
            last: query.length,
            before: query.cursor,
          },
        }),
      });
      data = await response.json();
    } catch (err) {
      console.log(err);
      dispatch(loadingData("eventFetch", false));
      return null;
    }
    if (data.errors) {
      console.log(data.errors.map((e) => e.message).join("\n"));
      dispatch(loadingData("eventFetch", false));
      return null;
    }
    if (data?.data?.search?.edges && Array.isArray(data.data.search.edges)) {
      const events = data.data.search.edges.map(({ node }) => ({
        ...node,
        fields: getObjFromKeyValArray(node.fields),
        metadata: getObjFromKeyValArray(node.metadata),
      }));
      const cursor = data.data.search.pageInfo.hasPreviousPage && _.last(data.data.search.edges).cursor;
      dispatch(receiveEventList(query, data.data.search.totalCount, events, cursor));
      dispatch(loadingData("eventFetch", false));
    } else {
      // token expired store cursor and query,then refresh token
      dispatch(loadingData("eventFetch", false));
      dispatch(storeCursor(query.cursor));
      dispatch(storeSearchText(query.search_text));
      if (refreshToken && typeof refreshToken === "function") {
        refreshToken();
      }
    }
  };
}
