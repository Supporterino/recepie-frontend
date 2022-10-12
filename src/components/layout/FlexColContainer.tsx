import { Box, Container } from '@mui/material';
import { alignCenterJustifyCenter } from './commonSx';

type FlexBoxProps = {
  header?: React.ReactNode;
  children?: React.ReactNode;
  sx?: {};
};

const FlexColContainer: React.FunctionComponent<FlexBoxProps> = ({
  children,
  sx,
  header
}: FlexBoxProps) => {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        overflow: ' hidden',
        display: 'flex',
        flexDirection: 'column',
        ...alignCenterJustifyCenter
      }}
    >
      {header}
      <Container
        sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', height: '100%', ...sx }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default FlexColContainer;
