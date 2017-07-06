import "isomorphic-fetch";

import { receiveEventList, receiveSessionId } from "./actions";
import { loadingData } from "../../ui/actions" ;

// const apiEndpoint = window.env.API_ENDPOINT;
const retracedEndpoint = "https://api.staging.retraced.io/viewer/v1";
let last = null;

export function createSession(token) {
  return async (dispatch) => {
    //dispatch(loadingData("signup", true));
    let response;
    const url = `${retracedEndpoint}/viewersession`;
    const payload = { token };
    response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.status > 400) {
      return
    }
    const body = await response.json();
    console.log(body);
    dispatch(receiveSessionId(body));
  };
}

export function requestEventSearch(projectId, environmentId, query) {
  return async (dispatch, getState) => {
    dispatch(loadingData("eventFetch", true));
    const q = { projectId, environmentId, query };
    if (_.isEqual(last, q)) {
      dispatch(loadingData("eventFetch", false));
      return;
    }
    last = q;

    const state = getState();
    // if (!_.isEmpty(state.data.eventsData.session)) { return; };
    // const url = `${apiEndpoint}/project/${projectId}/environment/${environmentId}/graphql`;
    // TEMP ONLY (Requires retraced composer to be running);
    const url = `${retracedEndpoint}/graphql`;
    // END TEMP DATA
    const response = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": state.data.eventsData.session.token,
      },
      body: JSON.stringify({
        variables: {
          query: query.search_text,
          last: query.length,
          before: query.cursor,
        },
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
                is_failure
                is_anonymous
                source_ip
                country
                loc_subdiv1
                loc_subdiv2
                raw
              }
            }
          }
        }`,
      }),
    });

    // TODO(zhaytee): Make API return proper status codes...
    // if (response.status === 403) {
    //    explode
    // }

    if (!response.ok) {
      return null;
    }

    const body = await response.json();
    const events = body.data.search.edges.map(({ node }) => node);
    const cursor = body.data.search.pageInfo.hasPreviousPage && _.last(body.data.search.edges).cursor;
    dispatch(receiveEventList(query, body.data.search.totalCount, events, cursor));
    dispatch(loadingData("eventFetch", false));
  };
}
