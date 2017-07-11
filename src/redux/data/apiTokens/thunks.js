import "isomorphic-fetch";

import { receiveApiTokens} from "./actions";
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
      console.log(result);
      dispatch(receiveApiTokens(result));

    } catch (err) {
        console.log(err);
      //dispatch(setIsLoading(false));
      //dispatch(setError(err));
    }
  };
}
