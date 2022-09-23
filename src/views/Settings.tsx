import {
  Button,
  Chip,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useContext } from 'react';
import ColorModeContext from '../services/ThemeContext';
import FlexColContainer from '../components/layout/FlexColContainer';
import { centerTopStyle } from '../components/layout/commonSx';
import Grid from '@mui/system/Unstable_Grid';
import { authenticationManager } from '../services/AuthenticationManager';
import { useSnackbar } from 'notistack';

const Settings: React.FunctionComponent = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { enqueueSnackbar } = useSnackbar()

  const logout = () => {
    authenticationManager.clear()
    enqueueSnackbar('Successfully logged out.', { variant: 'info' })
  }

  return (
    <FlexColContainer>
      <Divider sx={{my: 1, ...centerTopStyle}}>
        <Chip label="Theming" />
      </Divider>
      <Grid
        my={2}
        container
        justifyContent="space-evenly"
        alignItems="center"
        spacing={0}
        columns={12}
      >
        <Grid xs={6}>
          <Typography>
            {theme.palette.mode.charAt(0).toUpperCase() + theme.palette.mode.slice(1)} mode
          </Typography>
        </Grid>
        <Grid xs={6}>
          <ToggleButtonGroup
            fullWidth
            value={theme.palette.mode}
            exclusive
            onChange={(event, value) => {
              colorMode.toggleColorMode();
            }}
            color="primary"
          >
            <ToggleButton value="light" aria-label="left aligned">
              <LightModeIcon />
            </ToggleButton>
            <ToggleButton value="dark" aria-label="centered">
              <DarkModeIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <Divider sx={{my: 1, ...centerTopStyle}}>
        <Chip label="Account" />
      </Divider>
      <Button disabled={!authenticationManager.hasUser()} sx={{ my: 1 }} onClick={logout} variant='contained'>Logout</Button>
    </FlexColContainer>
  );
};

export default Settings;
