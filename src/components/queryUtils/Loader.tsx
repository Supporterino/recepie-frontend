import { Box, CircularProgress, Typography } from '@mui/material';
import { alignCenterJustifyCenter } from '../layout/commonSx';
import FlexCol from '../layout/FlexCol';

type LoaderProps = {
  text?: string;
};

const Loader: React.FunctionComponent<LoaderProps> = ({ text }: LoaderProps) => {
  return (
    <FlexCol sx={{ flexGrow: 1, ...alignCenterJustifyCenter }}>
      <Box
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          borderRadius: 4,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          ...alignCenterJustifyCenter
        }}
      >
        <CircularProgress sx={{ mx: 3, my: 1 }} />
        <Typography sx={{ mx: 1 }}>{text ? text : 'Loading...'}</Typography>
      </Box>
    </FlexCol>
  );
};

export default Loader;
