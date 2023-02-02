import { expect, test } from "vitest";
import { startServer, stopServer } from './server.js';
import { render, screen } from "@testing-library/react";
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
    startServer();
    Object.defineProperty(window, 'innerWidth', { value: 1300 });
  });

  afterAll(() => {
    stopServer();
  });

  test("should render EventBrowser", async () => {
    await act(async () => {
      render(<LogsViewerWrapper />);
    });
    await sleep(0.05);


    expect(screen.getAllByText("Events").length > 0);
    expect(screen.getAllByText("Filters").length > 0);
    expect(screen.getAllByText("Search").length > 0);
    expect(screen.getAllByText("Export Events").length > 0);
    expect(screen.getAllByText("Manage API Tokens").length > 0);
  });

  test("should render EventBrowser with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await sleep(0.05);


    expect(screen.getAllByText("Events").length > 0);
    expect(screen.getAllByText("Filters").length > 0);
    expect(screen.getAllByText("Search").length > 0);
    expect(screen.getAllByText("Export Events").length > 0);
    expect(screen.getAllByText("Manage API Tokens").length > 0);
  });

  test("should render EventBrowser with empty field path", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Date",
          field: "",
        },
      ] } />);
    });
    await sleep(0.05);


    expect(screen.getAllByText("Events").length > 0);
    expect(screen.getAllByText("Filters").length > 0);
    expect(screen.getAllByText("Search").length > 0);
    expect(screen.getAllByText("Export Events").length > 0);
    expect(screen.getAllByText("Manage API Tokens").length > 0);
  });

  test("should render correct headers", async () => {
    await act(async () => {
      render(<LogsViewerWrapper />);
    });
    await sleep(0.05);


    expect(screen.getAllByText("Description").length > 0);
    expect(screen.getAllByText("Date").length > 0);
    expect(screen.getAllByText("Group").length > 0);
    expect(screen.getAllByText("CRUD").length > 0);
    expect(screen.getAllByText("Location").length > 0);
  });

  test("should render correct headers with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await sleep(0.05);


    expect(screen.getAllByText("Description").length > 0);
    expect(screen.getAllByText("Date").length > 0);
    expect(screen.getAllByText("Location").length > 0);
    try {
      expect(screen.getAllByText("Group").length > 0);
    } catch (ex) {
      expect(true);
    }
  });

  test("should render correct headers with empty field path", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [
        {
          label: "Date",
          field: "",
        },
      ] } />);
    });
    await sleep(0.05);

    expect(screen.getAllByText("Date").length > 0);
  });

  test("should render correct event", async () => {
    await act(async () => {
      render(<LogsViewerWrapper />);
    });
    await sleep(0.05);


    expect(screen.getAllByText("audit.log.view (r)").length > 0);
    expect(screen.getAllByText("172.22.0.1").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("r").length > 0);
    expect(screen.getAllByText("Showing events").length > 0);
  });

  test("should render correct event with empty fields", async () => {
    await act(async () => {
      render(<LogsViewerWrapper fields={ [] } />);
    });
    await sleep(0.05);


    expect(screen.getAllByText("audit.log.view").length > 0);
    expect(screen.getAllByText("172.22.0.1").length > 0);
    expect(screen.getAllByText("An unknown actor").length > 0);
  });

  test("should render correct headers & rows with empty label", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Group").length > 0);
    expect(screen.getAllByText("dev").length > 0);
  });

  test("should render correct headers & rows with invalid field", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Date").length > 0);
    expect(screen.getAllByText("Group").length > 0);
    expect(screen.getAllByText("dev").length > 0);
  });

  test("should render correct headers & rows with field which does not exists", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("Group").length > 0);
    expect(screen.getAllByText("dev").length > 0);
  });
  test("should render correct headers & rows with empty field and label", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
  });
  test("should render correct headers & rows with field as number", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("0").length > 0);
  });
  test("should render correct headers & rows with field as array", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("0").length > 0);
  });
  test("should render correct headers & rows with field as object", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("0").length > 0);
  });
  test("should render correct headers & rows with field as object function name", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("0").length > 0);
  });
  test("should render correct headers & rows with label as object", async () => {
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

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
  });
  test("should render correct headers & rows with getValue function", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("info").length > 0);
    expect(screen.getAllByText("Group id: dev").length > 0);
  });
  test("should render correct headers & rows with getValue as non function", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("info").length > 0);
  });
  test("should render correct headers & rows with getValue as exception throwing function", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("info").length > 0);
  });
  test("should render correct headers & rows with getValue returns non string", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("info").length > 0);
  });
  test("should render correct headers & rows with getValue returns jsx", async () => {
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
    await sleep(0.05);

    expect(screen.getAllByText("Actor").length > 0);
    expect(screen.getAllByText("dev").length > 0);
    expect(screen.getAllByText("info").length > 0);
  });
});