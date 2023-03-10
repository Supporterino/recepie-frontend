/* eslint-disable @typescript-eslint/no-non-null-assertion */
import packageJson from '../../../package.json';
import {
  getBackendVersion,
} from '../../services/requests';
import {
  type VersionResponse,
} from '../../types/responses/version-response';
import {
  alignCenterJustifyCenter,
} from '../layout/commonSx';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import {
  Skeleton,
  Typography,
} from '@mui/material';
import {
  useQuery,
} from '@tanstack/react-query';
import {
  useTranslation,
} from 'react-i18next';

const Version: React.FunctionComponent = () => {
  const {
    isLoading,
    data: backendVersion,
  } = useQuery<VersionResponse>([
    'backendVersion',
  ], getBackendVersion);
  const {
    t,
  } = useTranslation('settings');

  return (
    <Flex sx={alignCenterJustifyCenter}>
      <FlexCol sx={{
        mx: 1,
        ...alignCenterJustifyCenter,
      }}
      >
        <Typography>{t('version.frontend')}</Typography>
        <Typography>v{packageJson.version}</Typography>
      </FlexCol>
      <FlexCol sx={{
        mx: 1,
        ...alignCenterJustifyCenter,
      }}
      >
        <Typography>{t('version.backend')}</Typography>
        <Typography>{isLoading ? <Skeleton animation='wave' width={45} /> : `${backendVersion!.version}`} </Typography>
      </FlexCol>
    </Flex>
  );
};

export default Version;
