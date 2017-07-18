import "isomorphic-fetch";

import { receiveEventList, receiveSessionId, receiveSavedExports } from "./actions";
import { loadingData } from "../../ui/actions" ;

let last = null;

export function createSession(token, host) {
  return async (dispatch, getState) => {
    //dispatch(loadingData("signup", true));

    let response;
    const url = `${host}/viewersession`;
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
    dispatch(receiveSessionId(body, host));
  };
}

