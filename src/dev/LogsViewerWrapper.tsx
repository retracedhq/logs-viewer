import { useEffect, useState } from "react";
import RetracedEventsBrowser from "../index";

const apiKey = "dev";
const projectId = "dev";
const endpoint = "http://localhost:3000/auditlog";
const groupId = "dev";
const actorId = "dev";

const LogsViewerWrapper = (props) => {
  const [token, setToken] = useState("");

  const fetchToken = () => {
    const urlWithQuery = `${endpoint}/publisher/v1/project/${projectId}/viewertoken?group_id=${groupId}&actor_id=${actorId}&is_admin=true`;
    fetch(urlWithQuery, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Token token=${apiKey}`,
      },
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setToken(data.token);
        });

        return;
      }

      throw new Error("Failed to fetch viewer token");
    });
  };

  useEffect(() => {
    if (!token) {
      fetchToken();
    }
  }, [token]);

  if (!token) {
    return <progress> </progress>;
  }

  const defaultFields = [
    {
      label: "Description",
      type: "markdown",
      field: "display.markdown",
    },
    {
      label: "Date",
      field: "canonical_time",
    },
    {
      label: "Group",
      field: "group",
    },
    {
      label: "CRUD",
      field: "crud",
    },
    {
      label: "Location",
      getValue: (event) => {
        return event.country || event.source_ip;
      },
    },
  ];

  return (
    <RetracedEventsBrowser
      auditLogToken={token}
      host={`${endpoint}/viewer/v1`}
      fields={props.fields ? (Array.isArray(props.fields) ? props.fields : defaultFields) : defaultFields}
      disableShowRawEvent={props.disableShowRawEvent ? props.disableShowRawEvent : false}
      skipViewLogEvent={false}
      refreshToken={fetchToken}
      toggleDisplay={{ fields: true, metadata: true }}
    />
  );
};

export default LogsViewerWrapper;
