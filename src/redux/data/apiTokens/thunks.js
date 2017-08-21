import "isomorphic-fetch";

import { receiveApiTokens } from "./actions";
import { loadingData } from "../../ui/actions" ;

let last = null;

export function fetchEitapiTokensList() {
  return async (dispatch, getState) => {
    dispatch(loadingData("apiTokens", true));
    //dispatch(setError(null));

    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;
    const host = state.data.sessionData.host;

    try {
      const url = `${host}/project/${projectId}/eitapi_tokens`;
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

      dispatch(loadingData("apiTokens", false));      
      dispatch(receiveApiTokens(result));

    } catch (err) {
        console.log(err);
        dispatch(loadingData("apiTokens", false));   
      //dispatch(setError(err));
    }
  };
}

export function createEitapiToken(name) {
  return async (dispatch, getState) => {
    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;
    const host = state.data.sessionData.host;    

    const payload = {
      displayName: name
    }

    try {
      const url = `${host}/project/${projectId}/eitapi_token`;
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

    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;
    const host = state.data.sessionData.host;    

    try {
      const url = `${host}/project/${projectId}/eitapi_token/${token.id}`;
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

export function updateEitapiToken(token, newName) {
  return async (dispatch, getState) => {
    //dispatch(setIsLoading(true));
    //dispatch(setError(null));

    const state = getState();
    const projectId = state.data.sessionData.session.project_id;
    const jwt = state.data.sessionData.session.token;
    const host = state.data.sessionData.host;    

    const newToken = {
      displayName: newName,
      id: token.id
    }

    try {
      const url = `${host}/project/${projectId}/eitapi_token/${token.id}`;
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(newToken),
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
