import uuid from "uuid/v4";

export const SessionManager = {
  setSessionId(id = uuid()) {
    window.sessionStorage.setItem("replicated.vendor.sessionid", id);
  },

  getSessionId() {
    var sessionId = window.sessionStorage.getItem("replicated.vendor.sessionid");
    if (!sessionId) {
      sessionId = uuid();
      this.setSessionId(sessionId);
    }
    return sessionId;
  },

  getBuildVersion() {
    return window.env.VENDOR_WEB_BUILD_VERSION;
  },

  getApiEndpoint(version = "1") {
    switch (version) {
      case "2":
        return window.env.VENDOR_API_ENDPOINT_V2;
      default:
        return window.env.VENDOR_API_ENDPOINT;
    }
  },

  intercom(action, team, user) {
    if (action === "shutdown") {
      window.Intercom(action);
    } else {
      window.Intercom(action, {
        app_id: window.env.INTERCOM_APP_ID,
        email: user.email,
        user_id: user.id,
        company: team.name,
        created_at: user.created, // This will probably be undefined all the time as it's not returned from the api in the user object
        hide_default_launcher: true,
      });
    }
  },
};
