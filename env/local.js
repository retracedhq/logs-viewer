module.exports = {
  RETRACED_ENV: "local",
  RETRACED_ENDPOINT: "https://api.retraced.io/viewer/v1",
  BUILD_VERSION: (function() {
    return String(Date.now());
  }()),
  RETRACED_BUGSNAG_STAGE: "development",
  LOGS_ENDPOINT: "http://localhost:6012",
};
