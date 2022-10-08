import { Skeleton, Typography } from '@mui/material';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import packageJson from '../../../package.json';
import { alignCenterJustifyCenter } from '../layout/commonSx';
import { useQuery } from '@tanstack/react-query';
import { getBackendVersion } from '../../services/requests';
import { VersionResponse } from '../../types/responses/version-response';

const Version: React.FunctionComponent = () => {
  const { isLoading, data: backendVersion } = useQuery<VersionResponse>(
    ['backendVersion'],
    getBackendVersion
  );

  return (
    <Flex sx={alignCenterJustifyCenter}>
      <FlexCol sx={{ mx: 1, ...alignCenterJustifyCenter }}>
        <Typography>Frontend</Typography>
        <Typography>v{packageJson.version}</Typography>
      </FlexCol>
      <FlexCol sx={{ mx: 1, ...alignCenterJustifyCenter }}>
        <Typography>Backend</Typography>
        <Typography>
          {isLoading ? <Skeleton animation="wave" width={45} /> : `${backendVersion!.version}`}{' '}
        </Typography>
      </FlexCol>
    </Flex>
  );
};

export default Version;