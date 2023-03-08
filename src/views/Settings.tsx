import {
    Button,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useContext } from 'react';
import ColorModeContext from '../services/ThemeContext';
import FlexColContainer from '../components/layout/FlexColContainer';
import { authenticationManager } from '../services/AuthenticationManager';
import { useSnackbar } from 'notistack';
import { alignCenterJustifyCenter, centerTopStyleRow } from '../components/layout/commonSx';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Version from '../components/meta/version';
import VerificationButton from '../components/user/VerificationButton';
import { useTranslation } from 'react-i18next';
import { availableLanguages, availableLanguagesType } from '../utils/i18n';
import LegalInfo from '../components/meta/legalInfo';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import Flex from '../components/layout/Flex';

const Settings: React.FunctionComponent = () => {
    const colorMode = useContext(ColorModeContext);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { t, i18n } = useTranslation(['settings', 'language']);

    const logout = () => {
        queryClient.clear();
        authenticationManager.clear();
        enqueueSnackbar('Successfully logged out.', { variant: 'info' });
        navigate('/');
    };

    return (
        <FlexColContainer>
            <Divider sx={{ my: 1, ...centerTopStyleRow }}>
                <Chip label={t('settings:headers.theming')} />
            </Divider>
            <Flex sx={alignCenterJustifyCenter}>
                <Typography sx={{ flexGrow: 1 }}>{t(`settings:theme.mode`)}</Typography>
                <ToggleButtonGroup
                    value={colorMode.getActiveMode()}
                    exclusive
                    onChange={(event, value) => {
                        colorMode.setColorMode(value);
                    }}
                    color="primary"
                >
                    <ToggleButton value="light">
                        <LightModeIcon sx={{ mx: 2 }} />
                    </ToggleButton>
                    <ToggleButton value="auto">
                        <BrightnessAutoIcon sx={{ mx: 2 }} />
                    </ToggleButton>
                    <ToggleButton value="dark">
                        <DarkModeIcon sx={{ mx: 2 }} />
                    </ToggleButton>
                </ToggleButtonGroup>
            </Flex>
            <Divider sx={{ my: 1, ...centerTopStyleRow }}>
                <Chip label={t('settings:headers.language')} />
            </Divider>
            <FormControl fullWidth>
                <InputLabel id="language-select-label">{t('settings:headers.language')}</InputLabel>
                <Select
                    labelId="language-select-label"
                    value={i18n.language}
                    label={t('settings:headers.language')}
                    onChange={(event: SelectChangeEvent) => i18n.changeLanguage(event.target.value)}
                >
                    {availableLanguages.map((lang: string) => (
                        <MenuItem value={lang}>{t(`language:${lang as availableLanguagesType}` as const)}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Divider sx={{ my: 1, ...centerTopStyleRow }}>
                <Chip label={t('settings:headers.account')} />
            </Divider>
            <Button disabled={!authenticationManager.hasUser()} sx={{ my: 1 }} onClick={logout} variant="contained">
                {t('settings:logoutButton')}
            </Button>
            <VerificationButton />
            <Divider sx={{ my: 1, ...centerTopStyleRow }}>
                <Chip label={t('settings:headers.version')} />
            </Divider>
            <Version />
            <LegalInfo />
        </FlexColContainer>
    );
};

export default Settings;
