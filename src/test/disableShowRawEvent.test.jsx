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

  test("EventBrowser rendered correct header and not More Info when disableShowRawEvent is true", async () => {
    await act(async () => {
      render(<LogsViewerWrapper disableShowRawEvent={ true } />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));


    expect(screen.queryAllByTestId("search-events").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("search-button").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("export-events").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("manage-api-tokens").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Description-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Date-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Group-2").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-CRUD-3").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Location-4").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-5").length).toBe(0);
  });

  test("EventBrowser rendered correct header and More info when disableShowRawEvent is false", async () => {
    await act(async () => {
      render(<LogsViewerWrapper disableShowRawEvent={ false } />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));


    expect(screen.queryAllByTestId("headers-Description-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Date-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Group-2").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-CRUD-3").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Location-4").length).toBeGreaterThanOrEqual(1);
    expect(screen.findAllByTestId("event-cell-moreinfo-5")).toBeDefined();
  });

});
