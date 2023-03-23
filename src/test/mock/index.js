export default (fetchMock) => {
  fetchMock.mockIf(/^http?:\/\/localhost:3000.*$/, (req) => {
    if (req.url.indexOf("/auditlog/publisher/v1/project/dev/viewertoken") !== -1) {
      return {
        body: JSON.stringify({ token: "06b6b5fc7b314a289ca0031d26776b56" }),
      };
    } else if (req.url.indexOf("/auditlog/viewer/v1/viewersession") !== -1) {
      return {
        body: JSON.stringify({
          project_id: "dev",
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA2YjZiNWZjN2IzMTRhMjg5Y2EwMDMxZDI2Nzc2YjU2IiwicHJvamVjdElkIjoiZGV2IiwiZW52aXJvbm1lbnRJZCI6ImRldiIsImdyb3VwSWQiOiJkZXYiLCJ2aWV3TG9nQWN0aW9uIjoiYXVkaXQubG9nLnZpZXciLCJhY3RvcklkIjoiZGV2IiwiY3JlYXRlZCI6MTY3NTI3NDQ5MTAwMCwic2NvcGUiOiIiLCJpcCI6IjE3Mi4yMi4wLjEiLCJpYXQiOjE2NzUyNzQ0OTJ9.rqER10z7C0-NeS8UO3uwdBW5nj52F1Zp_MYNPMQ_Als",
        }),
      };
    } else {
      return {
        body: JSON.stringify({
          data: {
            search: {
              totalCount: 1,
              pageInfo: { hasPreviousPage: true },
              edges: [
                {
                  cursor: "MTY3NTI3NDIyOTg1Niw0ZDBkNTdhZWVjNWY0NTE5OTU2OGI0Yzc5NWIyYjU2NA==",
                  node: {
                    id: "4d0d57aeec5f45199568b4c795b2b564",
                    action: "audit.log.view",
                    crud: "r",
                    created: null,
                    received: new Date(new Date().setSeconds(new Date().getSeconds() - 10)).toISOString(),
                    canonical_time: new Date(
                      new Date().setSeconds(new Date().getSeconds() - 10)
                    ).toISOString(),
                    description: "Viewed the audit log",
                    actor: { id: "dev", name: null, href: null },
                    group: { id: "dev", name: null },
                    target: { id: null, name: null, href: null, type: null },
                    display: { markdown: "**An unknown actor** performed the action **audit.log.view**." },
                    is_failure: null,
                    is_anonymous: null,
                    source_ip: "172.22.0.1",
                    country: null,
                    loc_subdiv1: null,
                    loc_subdiv2: null,
                    raw: '{"action":"audit.log.view","crud":"r","actor":{"id":"dev"},"group":{"id":"dev"},"description":"Viewed the audit log","source_ip":"172.22.0.1"}',
                  },
                },
              ],
            },
          },
        }),
      };
    }
  });
};
