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


    expect(screen.getAllByText("Events")).toBeDefined();
    expect(screen.getAllByText("Filters")).toBeDefined();
    expect(screen.getAllByText("Search")).toBeDefined();
    expect(screen.getAllByText("Export Events")).toBeDefined();
    expect(screen.getAllByText("Manage API Tokens")).toBeDefined();
  });

  test("EventBrowser rendered correct headers with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));


    expect(screen.getAllByText("Description")).toBeDefined();
    expect(screen.getAllByText("Date")).toBeDefined();
    expect(screen.getAllByText("Location")).toBeDefined();
    expect(screen.queryByText("Group")).toBeNull();
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