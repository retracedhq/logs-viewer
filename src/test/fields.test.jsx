import { assert, expect, test } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LogsViewerWrapper from "../dev/LogsViewerWrapper";
import fetch from 'node-fetch'
import { act } from "react-dom/test-utils";
global.fetch = fetch
global.matchMedia = media => ({
  addListener: () => { },
  removeListener: () => { },
  matches: media === '(min-width: 970px)',
});

const sleep = async (time) => {
  return new Promise((r) => {
    setTimeout(() => {
      r(1);
    }, time * 1000)
  });
}

test("should render EventBrowser", () => {
  act(async () => {
    render(<LogsViewerWrapper breakpoint="full" />);
    console.log("window", window.innerWidth);

    await sleep(5);

    expect(screen.getAllByText("Events").length > 0);
    expect(screen.getAllByText("Filters").length > 0);
    expect(screen.getAllByText("Search").length > 0);
    expect(screen.getAllByText("Export Events").length > 0);
    expect(screen.getAllByText("Manage API Tokens").length > 0);
  })
});
test("should render correct headers", () => {
  act(async () => {
    render(<LogsViewerWrapper breakpoint="full" />);
    console.log("window", window.innerWidth);

    await sleep(5);

    expect(screen.getAllByText("Description").length > 0);
    expect(screen.getAllByText("Date").length > 0);
    expect(screen.getAllByText("Group").length > 0);
    expect(screen.getAllByText("CRUD").length > 0);
    expect(screen.getAllByText("Location").length > 0);
  })
});

