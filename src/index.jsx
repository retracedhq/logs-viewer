import * as React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import Root from "./Root";

render((
  <AppContainer>
    <Root />
  </AppContainer>
), document.getElementById("app"));

if (module.hot) {
  module.hot.accept("./Root", () => {
    const NextRoot = require("./Root").default;
    render((
      <AppContainer>
        <NextRoot />
      </AppContainer>
    ), document.getElementById("app"));
  });
}
