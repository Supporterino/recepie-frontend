import {
  alignCenterJustifyCenter,
} from './commonSx';
import {
  type SxProps,
  type Theme,
} from '@mui/material';
import {
  Box,
  Container,
} from '@mui/material';

type FlexColContainerProps = {
  children?: React.ReactNode,
  header?: React.ReactNode,
  sx?: SxProps<Theme>,
};

const FlexColContainer: React.FunctionComponent<FlexColContainerProps> = ({
  children,
  sx,
  header,
}: FlexColContainerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: ' hidden',
        width: '100%',
        ...alignCenterJustifyCenter,
      }}
    >
      {header}
      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflowY: 'auto',
        ...sx,
      }}
      >{children}</Container>
    </Box>
  );
};

export default FlexColContainer;
