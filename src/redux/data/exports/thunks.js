import "isomorphic-fetch";

import { receiveEventList, receiveSessionId, receiveSavedExports } from "./actions";
import { loadingData } from "../../ui/actions" ;

// const apiEndpoint = window.env.API_ENDPOINT;
const retracedEndpoint = "https://api.staging.retraced.io/viewer/v1";
let last = null;

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
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;
    const exportUrl = `${retracedEndpoint}/project/${projectId}/export`;
    
    // TODO (10Dimensional): Update flow so that name can be associated with export id 
    const payload = {
      exportBody: {
        searchQuery: query,
        showCreate: true,
        showDelete: true,
        showRead: false,
        showUpdate: true,
        version: 1,
      },
      name,
    }

    dispatch(loadingData("exportCSVLoading", true));

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

      const downloadUrl = `${retracedEndpoint}/project/${projectId}/export/${exportResult.id}/rendered?jwt=${encodedJwt}`;
      window.location = downloadUrl;

      dispatch(loadingData("exportCSVLoading", false));

      //dispatch(setIsLoading(false));
      //dispatch(addNewSavedExport(result));

    } catch (err) {
      console.log(err);
      //dispatch(setIsLoading(false));
      //dispatch(setError(err));
    }
  };
}

export function renderSavedExport(id) {
  return async (dispatch, getState) => {
    //dispatch(setIsLoading(true));
    //dispatch(setError(null));


    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;
    const encodedJwt = encodeURIComponent(jwt);

    const downloadUrl = `${retracedEndpoint}/project/${projectId}/export/${id}/rendered?jwt=${encodedJwt}`;
    window.location = downloadUrl;

    //dispatch(setIsLoading(false));
    //dispatch(addNewSavedExport(result));
  };
}
