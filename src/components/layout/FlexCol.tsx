import {
  type SxProps,
  type Theme,
} from '@mui/material';
import {
  Box,
} from '@mui/material';

type FlexColProps = {
  children?: React.ReactNode,
  sx?: SxProps<Theme>,
};

const FlexCol: React.FunctionComponent<FlexColProps> = ({
  children,
  sx,
}: FlexColProps) => {
  return <Box sx={{
    display: 'flex',
    flexDirection: 'column',
    ...sx,
  }}
  >{children}</Box>;
};

export default FlexCol;
