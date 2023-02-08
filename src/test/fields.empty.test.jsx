import { expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import LogsViewerWrapper from "../dev/LogsViewerWrapper";
import createFetchMock from 'vitest-fetch-mock';
import { act } from "react-dom/test-utils";
import MockHelper from './mock';

const fetchMock = createFetchMock(vi);
global.fetch = fetchMock

global.fetch = fetch

describe('Log Viewer Component with empty list of fields', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'innerWidth', { value: 1300 });
    MockHelper(fetchMock);
  });

  afterAll(async () => {
    fetchMock.dontMock();
  });

  test("EventBrowser is correctly rendered with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));


    expect(screen.queryAllByTestId("search-events").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("search-button").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("export-events").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("manage-api-tokens").length).toBeGreaterThanOrEqual(1);
  });

  test("EventBrowser rendered correct headers with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));

    expect(screen.queryAllByTestId("headers-Description-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Date-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Location-2").length).toBeGreaterThanOrEqual(1);
    expect(screen.findAllByTestId("event-cell-moreinfo-3")).toBeDefined();
  });

  test("EventBrowser rendered correct event with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));


    expect(screen.findAllByText("audit.log.view")).toBeDefined();
    expect(screen.findAllByText("172.22.0.1")).toBeDefined();
    expect(screen.findAllByText("dev")).toBeDefined();
  });

});