import { expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import LogsViewerWrapper from "../dev/LogsViewerWrapper";
import createFetchMock from 'vitest-fetch-mock';
import { act } from "react-dom/test-utils";
import MockHelper from './mock';
const fetchMock = createFetchMock(vi);
global.fetch = fetchMock

describe('Log Viewer Component disableShowRawEvent tests', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1300 });
    MockHelper(fetchMock);
  });

  afterAll(() => {
    fetchMock.dontMock();
  });

  test("EventBrowser rendered correct header and values when disableShowRawEvent is true", async () => {
    await act(async () => {
      render(<LogsViewerWrapper disableShowRawEvent={ true } />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));


    expect(screen.getAllByText("Events")).toBeDefined();
    expect(screen.getAllByText("Filters")).toBeDefined();
    expect(screen.getAllByText("Search")).toBeDefined();
    expect(screen.getAllByText("Export Events")).toBeDefined();
    expect(screen.getAllByText("Manage API Tokens")).toBeDefined();
    expect(screen.getAllByText("Description")).toBeDefined();
    expect(screen.getAllByText("Date")).toBeDefined();
    expect(screen.getAllByText("Location")).toBeDefined();
    expect(screen.queryByText("Group")).toBeDefined();
    expect(screen.queryAllByTestId("event-cell-moreinfo-5").length).toBe(0);
  });

  test("EventBrowser rendered correct header and values when disableShowRawEvent is false", async () => {
    await act(async () => {
      render(<LogsViewerWrapper disableShowRawEvent={ false } />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));


    expect(screen.getAllByText("Description")).toBeDefined();
    expect(screen.getAllByText("Date")).toBeDefined();
    expect(screen.getAllByText("Group")).toBeDefined();
    expect(screen.getAllByText("CRUD")).toBeDefined();
    expect(screen.getAllByText("Location")).toBeDefined();
    expect(screen.getAllByText("Description")).toBeDefined();
    expect(screen.getAllByText("Date")).toBeDefined();
    expect(screen.getAllByText("Location")).toBeDefined();
    expect(screen.queryByText("Group")).toBeDefined();
    expect(screen.findAllByTestId("event-cell-moreinfo-5")).toBeDefined();
  });

});
