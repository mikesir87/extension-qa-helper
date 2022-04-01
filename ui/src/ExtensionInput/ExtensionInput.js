import { Box, Chip } from "@mui/material";
import { useVersionsData } from "../Versions/VersionsProvider";
import { ExtensionInputForm } from "./ExtensionInputForm";

export const ExtensionInput = () => {
  const { extensionName, setExtensionName } = useVersionsData();

  if (extensionName) {
    return (
      <Box marginTop={"1em"}>
        <strong>Working with:</strong> { extensionName }
        &nbsp;&nbsp;
        <Chip onClick={() => setExtensionName(null)} label="Change" />
      </Box>
    )
  }

  return (
    <ExtensionInputForm onSubmit={setExtensionName} />
  );
};