import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useCallback, useState } from "react";

export const ExtensionInputForm = ({ onSubmit }) => {
  const [extensionName, setExtensionName] = useState("");

  const onNameChange = useCallback((evt) => {
    setExtensionName(evt.target.value);
  }, [setExtensionName]);

  const onSubmitLocal = useCallback((evt) => {
    evt.preventDefault();
    onSubmit(extensionName);
  }, [onSubmit, extensionName]);

  return (
    <Box
      display={"flex"}
      alignContent="center"
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection="column"
      height="100%"
      width="100%"
    >
      <Typography variant="h4" gutterBottom>
        Extension QA Helper
      </Typography>

      <Typography variant="p" gutterBottom sx={{ marginBottom: "2em" }}>
        This tool is used to help make switching between extensions simpler, making QA and validation easier.
      </Typography>
      
      <form onSubmit={onSubmitLocal}>
        <Grid container alignItems={"center"} spacing={3}>
          <Grid item width={"300px"}>
            <TextField 
              id="extension-name" 
              label="Extension Name" 
              variant="outlined"
              fullWidth
              onChange={onNameChange}
              value={extensionName}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              variant="contained"
            >
              Set Extension
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};