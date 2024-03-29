import { expect, test, vi } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import LogsViewerWrapper from "../dev/LogsViewerWrapper";
import createFetchMock from "vitest-fetch-mock";
import MockHelper from "./mock";

const fetchMock = createFetchMock(vi);
global.fetch = fetchMock;

describe("Log Viewer Component with custom fields", () => {
  beforeAll(() => {
    Object.defineProperty(window, "innerWidth", { value: 1300 });
    MockHelper(fetchMock);
  });

  afterAll(() => {
    fetchMock.dontMock();
  });

  test("EventBrowser is correctly rendered with empty field path", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Date",
              field: "",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("headerTitle"));

    expect(screen.queryAllByTestId("search-events").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("search-button").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("export-events").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("manage-api-tokens").length).toBeGreaterThanOrEqual(1);
  });

  test("EventBrowser rendered correct headers with empty field path", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Date",
              field: "",
            },
            {
              label: "Group",
              field: "group",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("headerTitle"));

    expect(screen.queryAllByTestId("headers-Date-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Group-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
    expect(screen.findAllByText("dev")).toBeDefined();
  });

  test("EventBrowser rendered correct event", async () => {
    await act(async () => {
      render(<LogsViewerWrapper />);
    });
    await waitFor(() => screen.findByTestId("event-cell-4"));

    expect(screen.findByTestId("markdown")).toBeDefined();
    expect(screen.findAllByText("172.22.0.1")).toBeDefined();
    expect(screen.findAllByText("dev")).toBeDefined();
    expect(screen.findAllByText("a few seconds ago")).toBeDefined();
    expect(screen.findAllByText("r")).toBeDefined();
    expect(screen.queryAllByTestId("showing-events").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with empty label", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "",
              field: "canonical_time",
            },
            {
              label: "Group",
              field: "group",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Group-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
    expect(screen.getByText("a few seconds ago")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with invalid field", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Date",
              field: "canonical_time123",
            },
            {
              label: "Group",
              field: "group",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Date-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Group-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
    expect(screen.getAllByText("dev")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with field which does not exists", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "Group",
              field: "group.name.id.date",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-Group-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
    expect(screen.getAllByText("dev")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with empty field and label", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "",
              field: "",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
    expect(screen.getAllByText("dev")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with field as number", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "0",
              field: 0,
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("headers-0-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("0")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with field as array", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "0",
              field: [1, 2, 3, 4],
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("headers-0-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with field as object", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "0",
              field: { a: "c" },
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("headers-0-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with field as object function name", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "0",
              field: "valueOf",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("headers-0-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with label as object", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: { a: "c" },
              field: "group",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with getValue function", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "info",
              getValue: (event) => {
                return `Group id: ${event.group.id}`;
              },
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("headers-info-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Group id: dev")).toBeDefined();
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with getValue as non function", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "info",
              getValue: {},
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
    expect(screen.queryAllByTestId("headers-info-1").length).toBeGreaterThanOrEqual(1);
  });

  test("EventBrowser rendered correct headers & rows with getValue as exception throwing function", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "info",
              getValue: () => {
                throw new Error("Testing exceptions");
              },
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("headers-info-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with getValue returns non string", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "info",
              getValue: (event) => {
                return event.group;
              },
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("headers-info-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with getValue returns jsx", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {
              label: "Actor",
              field: "actor",
            },
            {
              label: "info",
              getValue: () => {
                return <div>123</div>;
              },
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("headers-info-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with empty object in fields", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            {},
            {
              label: "Actor",
              field: "actor",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-1"));

    expect(screen.queryAllByTestId("headers-Actor-1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("event-cell-moreinfo-2").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with empty array in fields", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            [],
            {
              label: "Actor",
              field: "actor",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-0"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("event-cell-moreinfo-1").length).toBe(1);
  });

  test("EventBrowser rendered correct headers & rows with undefined in fields", async () => {
    await act(async () => {
      render(
        <LogsViewerWrapper
          fields={[
            undefined,
            {
              label: "Actor",
              field: "actor",
            },
          ]}
        />
      );
    });
    await waitFor(() => screen.findByTestId("event-cell-0"));

    expect(screen.queryAllByTestId("headers-Actor-0").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.queryAllByTestId("event-cell-moreinfo-1").length).toBe(1);
  });
});
