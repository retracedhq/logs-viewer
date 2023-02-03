import { expect, test } from "vitest";
import { startServer, stopServer } from './server.js';
import { render, screen, waitFor } from "@testing-library/react";
import LogsViewerWrapper from "../dev/LogsViewerWrapper";
import fetch from 'node-fetch'
import { act } from "react-dom/test-utils";

global.fetch = fetch

describe('Log Viewer Component basic tests', () => {
  beforeAll(() => {
    try {
      Object.defineProperty(window, 'innerWidth', { value: 1300 });
      startServer();
    } catch (ex) {

    }
  });

  afterAll(() => {
    stopServer();
  });

  test("EventBrowser is correctly rendered", async () => {
    await act(async () => {
      render(<LogsViewerWrapper />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));


    expect(screen.getAllByText("Events")).toBeDefined();
    expect(screen.getAllByText("Filters")).toBeDefined();
    expect(screen.getAllByText("Search")).toBeDefined();
    expect(screen.getAllByText("Export Events")).toBeDefined();
    expect(screen.getAllByText("Manage API Tokens")).toBeDefined();
  });

  test("EventBrowser rendered correct headers", async () => {
    await act(async () => {
      render(<LogsViewerWrapper />);
    });
    await waitFor(() => screen.findByTestId('headerTitle'));


    expect(screen.getAllByText("Description")).toBeDefined();
    expect(screen.getAllByText("Date")).toBeDefined();
    expect(screen.getAllByText("Group")).toBeDefined();
    expect(screen.getAllByText("CRUD")).toBeDefined();
    expect(screen.getAllByText("Location")).toBeDefined();
  });

});
