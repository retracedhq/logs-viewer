import "isomorphic-fetch";

import { receiveApiTokens } from "./actions";
import { loadingData } from "../../ui/actions" ;

// const apiEndpoint = window.env.API_ENDPOINT;
const retracedEndpoint = "https://api.staging.retraced.io/viewer/v1";
let last = null;

export function fetchEitapiTokensList() {
  return async (dispatch, getState) => {
    //dispatch(setIsLoading(true));
    //dispatch(setError(null));

    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;

    try {
      const url = `${retracedEndpoint}/project/${projectId}/eitapi_tokens`;
      const response = await fetch(url, {
        headers: {
          Authorization: jwt,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      //dispatch(setIsLoading(false));

      dispatch(receiveApiTokens(result));

    } catch (err) {
        console.log(err);
      //dispatch(setIsLoading(false));
      //dispatch(setError(err));
    }
  };
}

export function createEitapiToken(name) {
  return async (dispatch, getState) => {
    dispatch(loadingData("apiTokensLoading", true));

    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;

    const payload = {
      displayName: name
    }

    try {
      const url = `${retracedEndpoint}/project/${projectId}/eitapi_token`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: jwt,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      // New one is created, let's grab a fresh list.
      dispatch(loadingData("apiTokensLoading", false));
      dispatch(fetchEitapiTokensList());

    } catch (err) {
      console.log(err);
      //dispatch(setIsLoading(false));
      //dispatch(setError(err));
    }
  };
}

export function deleteEitapiToken(token) {
  return async (dispatch, getState) => {
    //dispatch(setIsLoading(true));
    //dispatch(setError(null));

    console.log(token);

    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;

    try {
      const url = `${retracedEndpoint}/project/${projectId}/eitapi_token/${token.id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: jwt,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      // Deletion complete, let's grab a fresh list.
      dispatch(fetchEitapiTokensList());

    } catch (err) {
      console.log(err);
      //dispatch(setIsLoading(false));
      //dispatch(setError(err));
    }
  };
}

export function updateEitapiToken(token) {
  return async (dispatch, getState) => {
    //dispatch(setIsLoading(true));
    //dispatch(setError(null));

    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;

    try {
      const url = `${retracedEndpoint}/project/${projectId}/eitapi_token/${token.id}`;
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(token),
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      // Update complete, let's grab a fresh list.
      dispatch(fetchEitapiTokensList());

    } catch (err) {
      console.log(err);
      //dispatch(setIsLoading(false));
      //dispatch(setError(err));
    }
  };
}
