import { useEffect, useState } from "react";
import RetracedEventsBrowser from "../index";

const apiKey = "dev";
const projectId = "dev";
const endpoint = "http://localhost:3000/auditlog";
const groupId = "dev";
const actorId = "dev";

const LogsViewerWrapper = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!token) {
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
    }
  }, []);

  if (!token) {
    return <progress> </progress>;
  }

  return (
    <RetracedEventsBrowser
      auditLogToken={token}
      host={`${endpoint}/viewer/v1`}
    />
  );
};

export default LogsViewerWrapper;
