import {
  alignCenterJustifyCenter,
} from '../layout/commonSx';
import FlexCol from '../layout/FlexCol';
import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  useTranslation,
} from 'react-i18next';

type LoaderProps = {
  text?: string,
};

const Loader: React.FunctionComponent<LoaderProps> = ({
  text,
}: LoaderProps) => {
  const {
    t,
  } = useTranslation('common');
  return (
    <FlexCol sx={{
      flexGrow: 1,
      ...alignCenterJustifyCenter,
    }}
    >
      <Box
        sx={{
          backgroundColor: (theme) => {
            return theme.palette.background.default;
          },
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          ...alignCenterJustifyCenter,
        }}
      >
        <CircularProgress sx={{
          mx: 3,
          my: 1,
        }}
        />
        <Typography sx={{
          mx: 1,
        }}
        >{text ? text : t('loader.text')}</Typography>
      </Box>
    </FlexCol>
  );
};

export default Loader;
