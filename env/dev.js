module.exports = {
  RETRACED_ENV: "development",
  RETRACED_ENDPOINT: "http://localhost:3000/auditlog/viewer/v1",
  BUILD_VERSION: (function () {
    return String(Date.now());
  })(),
  RETRACED_BUGSNAG_STAGE: "development",
  LOGS_ENDPOINT: "http://localhost:6012",
};
