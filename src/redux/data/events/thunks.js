import "isomorphic-fetch";

import { receiveEventList, receiveSessionId, receiveSavedExports } from "./actions";
import { loadingData } from "../../ui/actions" ;

let last = null;

export function requestEventSearch(query) {
  return async (dispatch, getState) => {
    dispatch(loadingData("eventFetch", true));
    const q = { query };

    const state = getState();
    const host = state.data.sessionData.host;
    const url = `${host}/graphql`;
    var body;
    try {
      const response = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": state.data.sessionData.session.token,
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
    if (!response.ok) {
      return null;
    }
    body = await response.json();
    } catch(err) {
      console.log(err);
    }

    // TODO(zhaytee): Make API return proper status codes...
    // if (response.status === 403) {
    //    explode
    // }

    const events = body.data.search.edges.map(({ node }) => node);
    const cursor = body.data.search.pageInfo.hasPreviousPage && _.last(body.data.search.edges).cursor;
    dispatch(receiveEventList(query, body.data.search.totalCount, events, cursor));
    dispatch(loadingData("eventFetch", false));
  };
}
