import { useEffect, useState } from "react";
import { getViaProxy } from "../api/proxy";

export const VersionList = () => {
  const [tags, setTags] = useState(null);
  useEffect(() => {
    getViaProxy("https://registry.hub.docker.com/v1/repositories/mikesir87/demo-extension/tags")
      .then(setTags);
  }, []);

  if (!tags) {
    return <p>Loading...</p>
  }

  return <p>Nothing yet!!</p>
};