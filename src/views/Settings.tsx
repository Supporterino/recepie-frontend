import {
  alignCenterJustifyCenter,
  centerTopStyleRow,
} from '../components/layout/commonSx';
import Flex from '../components/layout/Flex';
import FlexColContainer from '../components/layout/FlexColContainer';
import LegalInfo from '../components/meta/LegalInfo';
import Version from '../components/meta/Version';
import VerificationButton from '../components/user/VerificationButton';
import {
  authenticationManager,
} from '../services/AuthenticationManager';
import ColorModeContext from '../services/ColorModeContext';
import {
  type availableLanguagesType,
} from '../utils/i18n';
import {
  availableLanguages,
} from '../utils/i18n';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  type SelectChangeEvent,
} from '@mui/material';
import {
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import {
  useQueryClient,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import {
  useContext,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';
import {
  useNavigate,
} from 'react-router-dom';

const Settings: React.FunctionComponent = () => {
  const colorMode = useContext(ColorModeContext);
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    t,
    i18n,
  } = useTranslation([
    'settings',
    'language',
  ]);

  const logout = () => {
    queryClient.clear();
    authenticationManager.clear();
    enqueueSnackbar('Successfully logged out.', {
      variant: 'info',
    });
    navigate('/');
  };

  return (
    <FlexColContainer>
      <Divider sx={{
        my: 1,
        ...centerTopStyleRow,
      }}
      >
        <Chip label={t('settings:headers.theming')} />
      </Divider>
      <Flex sx={alignCenterJustifyCenter}>
        <Typography sx={{
          flexGrow: 1,
        }}
        >{t('settings:theme.mode')}</Typography>
        <ToggleButtonGroup
          color='primary'
          exclusive
          onChange={(event, value) => {
            colorMode.setColorMode(value);
          }}
          value={colorMode.getActiveMode()}
        >
          <ToggleButton value='light'>
            <LightModeIcon sx={{
              mx: 2,
            }}
            />
          </ToggleButton>
          <ToggleButton value='auto'>
            <BrightnessAutoIcon sx={{
              mx: 2,
            }}
            />
          </ToggleButton>
          <ToggleButton value='dark'>
            <DarkModeIcon sx={{
              mx: 2,
            }}
            />
          </ToggleButton>
        </ToggleButtonGroup>
      </Flex>
      <Divider sx={{
        my: 1,
        ...centerTopStyleRow,
      }}
      >
        <Chip label={t('settings:headers.language')} />
      </Divider>
      <FormControl fullWidth>
        <InputLabel id='language-select-label'>{t('settings:headers.language')}</InputLabel>
        <Select
          label={t('settings:headers.language')}
          labelId='language-select-label'
          onChange={(event: SelectChangeEvent) => {
            return i18n.changeLanguage(event.target.value);
          }}
          value={i18n.language}
        >
          {availableLanguages.map((lang: string) => {
            return <MenuItem key={lang} value={lang}>{t(`language:${lang as availableLanguagesType}` as const)}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <Divider sx={{
        my: 1,
        ...centerTopStyleRow,
      }}
      >
        <Chip label={t('settings:headers.account')} />
      </Divider>
      <Button
        disabled={!authenticationManager.hasUser()} onClick={logout} sx={{
          my: 1,
        }}
        variant='contained'
      >
        {t('settings:logoutButton')}
      </Button>
      <VerificationButton />
      <Divider sx={{
        my: 1,
        ...centerTopStyleRow,
      }}
      >
        <Chip label={t('settings:headers.version')} />
      </Divider>
      <Version />
      <LegalInfo />
    </FlexColContainer>
  );
};

export default Settings;
