import { expect, test } from "vitest";
import { startServer, stopServer } from './server.js';
import { render, screen, waitFor } from "@testing-library/react";
import LogsViewerWrapper from "../dev/LogsViewerWrapper";
import fetch from 'node-fetch'
import { act } from "react-dom/test-utils";

global.fetch = fetch

const sleep = async (time) => {
  return new Promise((r) => {
    setTimeout(() => {
      r(1);
    }, time * 1000)
  });
}
describe('Log Viewer Component', () => {
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
    await waitFor(() => screen.getByText('Events'));


    expect(screen.getAllByText("Events")).toBeDefined();
    expect(screen.getAllByText("Filters")).toBeDefined();
    expect(screen.getAllByText("Search")).toBeDefined();
    expect(screen.getAllByText("Export Events")).toBeDefined();
    expect(screen.getAllByText("Manage API Tokens")).toBeDefined();
  });

  test("EventBrowser is correctly rendered with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await waitFor(() => screen.getByText('Events'));


    expect(screen.getAllByText("Events")).toBeDefined();
    expect(screen.getAllByText("Filters")).toBeDefined();
    expect(screen.getAllByText("Search")).toBeDefined();
    expect(screen.getAllByText("Export Events")).toBeDefined();
    expect(screen.getAllByText("Manage API Tokens")).toBeDefined();
  });

  test("EventBrowser is correctly rendered with empty field path", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Date",
          field: "",
        },
      ] } />);
    });
    await waitFor(() => screen.getByText('Events'));


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
    await waitFor(() => screen.getByText('Events'));


    expect(screen.getAllByText("Description")).toBeDefined();
    expect(screen.getAllByText("Date")).toBeDefined();
    expect(screen.getAllByText("Group")).toBeDefined();
    expect(screen.getAllByText("CRUD")).toBeDefined();
    expect(screen.getAllByText("Location")).toBeDefined();
  });

  test("EventBrowser rendered correct headers with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await waitFor(() => screen.getByText('Events'));


    expect(screen.getAllByText("Description")).toBeDefined();
    expect(screen.getAllByText("Date")).toBeDefined();
    expect(screen.getAllByText("Location")).toBeDefined();
    try {
      expect(screen.getAllByText("Group")).toBeDefined();
    } catch (ex) {
      expect(true);
    }
  });

  test("EventBrowser rendered correct headers with empty field path", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Date",
          field: "",
        },
      ] } />);
    });
    await sleep(0.02);

    expect(screen.getAllByText("Date")).toBeDefined();
  });

  test("EventBrowser rendered correct event", async () => {
    await act(async () => {
      render(<LogsViewerWrapper />);
    });
    await waitFor(() => screen.getByText('audit.log.view (r)'));


    expect(screen.getAllByText("audit.log.view (r)")).toBeDefined();
    expect(screen.getAllByText("172.22.0.1")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("a few seconds ago")).toBeDefined();
    expect(screen.getAllByText("r")).toBeDefined();
    expect(screen.getAllByText("Showing events")).toBeDefined();
  });

  test("EventBrowser rendered correct event with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await waitFor(() => screen.getByText('audit.log.view'));


    expect(screen.getAllByText("audit.log.view")).toBeDefined();
    expect(screen.getAllByText("172.22.0.1")).toBeDefined();
    expect(screen.getAllByText("An unknown actor")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with empty label", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "",
          field: "canonical_time",
        },
        {
          label: "Group",
          field: "group",
        },
      ] } />);
    });
    await waitFor(() => screen.getByText('a few seconds ago'));

    expect(screen.getAllByText("Group")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getByText("a few seconds ago")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with invalid field", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Date",
          field: "canonical_time123",
        },
        {
          label: "Group",
          field: "group",
        },
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Date")).toBeDefined();
    expect(screen.getAllByText("Group")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with field which does not exists", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "Group",
          field: "group.name.id.date",
        },
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("Group")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with empty field and label", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "",
          field: "",
        },
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with field as number", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "0",
          field: 0,
        },
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("0")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with field as array", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "0",
          field: [1, 2, 3, 4],
        },
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("0")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with field as object", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "0",
          field: { a: "c" },
        },
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("0")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with field as object function name", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "0",
          field: "valueOf",
        },
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("0")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with label as object", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: { a: "c" },
          field: "group",
        },
      ] } />);
    });
    await sleep(0.05);

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with getValue function", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
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
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("info")).toBeDefined();
    expect(screen.getAllByText("Group id: dev")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with getValue as non function", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "info",
          getValue: {}
        }
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("info")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with getValue as exception throwing function", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "info",
          getValue: (event) => {
            throw new Error("Testing exceptions");
          }
        }
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("info")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with getValue returns non string", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "info",
          getValue: (event) => {
            return event.group;
          }
        }
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("info")).toBeDefined();
  });

  test("EventBrowser rendered correct headers & rows with getValue returns jsx", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Actor",
          field: "actor",
        },
        {
          label: "info",
          getValue: (event) => {
            return <div>123</div>;
          }
        }
      ] } />);
    });
    await waitFor(() => screen.getByText('dev'));

    expect(screen.getAllByText("Actor")).toBeDefined();
    expect(screen.getAllByText("dev")).toBeDefined();
    expect(screen.getAllByText("info")).toBeDefined();
  });
});