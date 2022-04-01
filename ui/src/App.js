import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import CssBaseline from '@mui/material/CssBaseline';
import { ExtensionInput } from './ExtensionInput/ExtensionInput';
import { VersionList } from './Versions/VersionList';
import { VersionsProvider } from './Versions/VersionsProvider';

function App() {
  return (
    <VersionsProvider>
      <DockerMuiThemeProvider>
        <CssBaseline />
        <ExtensionInput />
        <VersionList />
      </DockerMuiThemeProvider>
    </VersionsProvider>
  );
}

export default App;
