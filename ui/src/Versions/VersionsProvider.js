import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getViaProxy } from "../api/proxy";

const LOCAL_STORAGE_NAME_KEY = "extension-qa-helper/name";

const VersionsContext = createContext(null);

export const VersionsProvider = ({ children }) => {
  const [extensionName, setExtensionName] = useState(localStorage.getItem(LOCAL_STORAGE_NAME_KEY));
  const [remoteTags, setRemoteTags] = useState(null);
  const [installedExtensions, setInstalledExtensions] = useState(null);
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);

  useEffect(() => {
    setRemoteTags(null);
    if (!extensionName)
      return;

    getViaProxy(`https://hub.docker.com/v2/repositories/${extensionName}/tags/?page_size=25&registry&ordering=last_updated`)
      .then((body) => setRemoteTags(body.results));
  }, [extensionName, setRemoteTags]);

  useEffect(() => {
    let receivedData = "";

    window.ddClient.docker.cli.exec("extension", ["ls", "--format=json"], {
      stream: {
        onOutput: data => receivedData += data.stdout,
        onClose: () => setInstalledExtensions(JSON.parse(receivedData)),
      }
    })
  }, [forceUpdateCounter]);

  const forceInstallExtensionSync = useCallback(() => {
    setForceUpdateCounter(c => c + 1);
  }, [setForceUpdateCounter]);

  const updateExtensionName = useCallback((name) => {
    setExtensionName(name);
    if (name === null)
      return localStorage.removeItem(LOCAL_STORAGE_NAME_KEY);
      
    localStorage.setItem(LOCAL_STORAGE_NAME_KEY, name);
  }, []);

  return (
    <VersionsContext.Provider value={{ extensionName, setExtensionName : updateExtensionName, remoteTags, installedExtensions, forceInstallExtensionSync }}>
      { children }
    </VersionsContext.Provider>
  )
};

export const useVersionsData = () => useContext(VersionsContext);