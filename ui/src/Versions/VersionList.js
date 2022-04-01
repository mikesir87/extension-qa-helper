import { Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useVersionsData } from "./VersionsProvider";
import ReactTimeAgo from "react-time-ago";

export const VersionList = () => {
  const { extensionName, remoteTags, installedExtensions, forceInstallExtensionSync } = useVersionsData();
  const [installedTag, setInstalledTag] = useState(null);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (!installedExtensions) return;

    const existingInstalledExtension = installedExtensions
      .find((extension) => extension.image.split(":")[0] === extensionName);

    if (!existingInstalledExtension)
      return setInstalledTag(null);

    setInstalledTag(existingInstalledExtension.image.split(":")[1]);
  }, [extensionName, installedExtensions, setInstalledTag]);

  const onInstallVersion = useCallback((tag) => {
    setInstalling(tag.name);

    const action = installedTag ? "update" : "install";

    window.ddClient.docker.cli.exec("extension", [action, `${extensionName}:${tag.name}`], {
      stream: {
        onOutput: console.log,
        onClose: () => {
          forceInstallExtensionSync();
          setInstalling(false);
        },
      }
    });
  }, [setInstalling, installedTag, extensionName, forceInstallExtensionSync]);

  const onUninstall = useCallback((tag) => {
    setInstalling(tag.name);

    window.ddClient.docker.cli.exec("extension", ["uninstall", `${extensionName}`], {
      stream: {
        onOutput: console.log,
        onClose: () => {
          forceInstallExtensionSync();
          setInstalling(false);
        },
      }
    });
  }, [setInstalling, extensionName, forceInstallExtensionSync]);

  if (!extensionName)
    return null;

  if (!remoteTags) {
    return "Loading...";
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image Tag</TableCell>
            <TableCell>Last Updated</TableCell>
            <TableCell>Last Updated By</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          { remoteTags.map(tag => (
            <TableRow key={tag.id}>
              <TableCell>{ tag.name }</TableCell>
              <TableCell>
                <ReactTimeAgo date={new Date(tag.last_updated)} locale="en-US"/>
              </TableCell>
              <TableCell>{ tag.last_updater_username }</TableCell>
              <TableCell sx={{ textAlign: "center" }} width="130px">
                { tag.name === installedTag ? 
                (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => onUninstall(tag)}
                    disabled={installing}
                  >
                    { installing === tag.name ? "Uninstalling..." : "Uninstall" }
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    onClick={() => onInstallVersion(tag)}
                    disabled={installing}
                  >
                    { installing === tag.name ? "Installing..." : "Install" }
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
};