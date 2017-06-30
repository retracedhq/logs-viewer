module.exports = {
  RETRACED_ENV: "prod",
  RETRACED_API_ENDPOINT: "https://api.retraced.io/v1",
  BUILD_VERSION: (function() {
    return process.env.BUILD_VERSION;
  }()),
  RETRACED_BUGSNAG_STAGE: "production",
  LOGS_ENDPOINT: "https://logs.retraced.io",
};
