import "isomorphic-fetch";
import * as url from "url";

import { receiveEventList, receiveSessionId, receiveSavedExports } from "./actions";
import { loadingData } from "../../ui/actions" ;

let last = null;

export function fetchSavedExports(limit) {
  return async (dispatch, getState) => {
    // dispatch(setIsLoading(true));
    // dispatch(setError(null));

    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;
    const host = state.data.sessionData.host;

    try {
      const q = url.format({ query: { limit } });
      const urlWithQuery = `${host}/project/${projectId}/exports${q}`;
      const response = await fetch(urlWithQuery, {
        headers: {
          Authorization: jwt,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      // dispatch(setIsLoading(false));
      dispatch(receiveSavedExports(result));

    } catch (err) {
      console.log(err);
      // dispatch(setIsLoading(false));
      // dispatch(setError(err));
    }
  };
}

export function createSavedExport(query, name) {
  return async (dispatch, getState) => {
    //dispatch(setIsLoading(true));
    //dispatch(setError(null));

    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;
    const host = state.data.sessionData.host;
    const exportUrl = `${host}/project/${projectId}/export`;
    
    // TODO (10Dimensional): Update flow so that name can be associated with export id 
    const payload = {
      exportBody: {
        searchQuery: query,
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
      
      dispatch(fetchSavedExports());

      const downloadUrl = `${host}/project/${projectId}/export/${exportResult.id}/rendered?jwt=${encodedJwt}`;
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
    const host = state.data.sessionData.host;
    const encodedJwt = encodeURIComponent(jwt);

    const downloadUrl = `${host}/project/${projectId}/export/${id}/rendered?jwt=${encodedJwt}`;
    window.location = downloadUrl;

    //dispatch(setIsLoading(false));
    //dispatch(addNewSavedExport(result));
  };
}
