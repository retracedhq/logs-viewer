import "isomorphic-fetch";

import { receiveEventList, receiveSessionId, receiveSavedExports } from "./actions";
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
    dispatch(receiveSessionId(body));
  };
}

export function requestEventSearch(query) {
  return async (dispatch, getState) => {
    dispatch(loadingData("eventFetch", true));
    const q = { query };
    if (_.isEqual(last, q)) {
      dispatch(loadingData("eventFetch", false));
      return;
    }
    last = q;

    const state = getState();
    const url = `${retracedEndpoint}/graphql`;
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

export function fetchSavedExports(limit) {
  // Temporary until we receive API support for export downloads
  return async (dispatch) => {
    //Retrieve exports from localtorage, save to store
    const currentSavedExports = await JSON.parse(localStorage.getItem("savedExports"));

    if(currentSavedExports) {
      dispatch(receiveSavedExports(currentSavedExports));
    } 
  }

  // return async dispatch => {
  //   dispatch(setIsLoading(true));
  //   dispatch(setError(null));

  //   const projectId = sessionStore.getProjectId();
  //   const jwt = sessionStore.getJWT();

  //   try {
  //     const q = url.format({ query: { limit } });
  //     const urlWithQuery = `${Config.apiEndpoint}/project/${projectId}/exports${q}`;
  //     const response = await fetch(urlWithQuery, {
  //       headers: {
  //         Authorization: jwt,
  //         Accept: "application/json",
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`${response.status} ${response.statusText}`);
  //     }

  //     const result = await response.json();
  //     dispatch(setIsLoading(false));
  //     dispatch(receiveSavedExports(result));

  //   } catch (err) {
  //     dispatch(setIsLoading(false));
  //     dispatch(setError(err));
  //   }
  // };
}

export function createSavedExport(query, name) {
  return async (dispatch, getState) => {
    //dispatch(setIsLoading(true));
    //dispatch(setError(null));

    const state = getState();
    const projectId = state.data.eventsData.session.project_id;
    const jwt = state.data.eventsData.session.token;
    const exportUrl = `${retracedEndpoint}/project/${projectId}/export`;
    
    // TODO (10Dimensional): Update flow so that name can be associated with export id 
    const payload = {
      exportBody: query,
      name: "",
    }

    try {
      const exportResponse = await fetch(exportUrl, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: jwt,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!exportResponse.ok) {
        throw new Error(`${exportResponse.status} ${exportResponse.statusText}`);
      }

      const exportResult = await exportResponse.json();
      const encodedJwt = encodeURIComponent(jwt);
      
      // Temporary, until we have API support for saving exports
      const savedExports = [];
      if(localStorage.getItem("savedExports")) {
        const oldExports = JSON.parse(localStorage.getItem("savedExports"));
        savedExports = oldExports;
      }

      savedExports.push(exportResult);
      localStorage.setItem("savedExports", JSON.stringify(savedExports));

      dispatch(fetchSavedExports());

      return exportResult;
      //const downloadUrl = `${retracedEndpoint}/project/${projectId}/export/${exportResult.id}/rendered?jwt=${encodedJwt}`;
      //window.location = downloadUrl;

      //dispatch(setIsLoading(false));
      //dispatch(addNewSavedExport(result));

    } catch (err) {
      console.log(err);
      //dispatch(setIsLoading(false));
      //dispatch(setError(err));
    }
  };
}
