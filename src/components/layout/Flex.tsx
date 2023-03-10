import {
  type SxProps,
  type Theme,
} from '@mui/material';
import {
  Box,
} from '@mui/material';

type FlexProps = {
  children?: React.ReactNode,
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined,
  sx?: SxProps<Theme>,
};

const Flex: React.FunctionComponent<FlexProps> = ({
  children,
  sx,
  onClick,
}: FlexProps) => {
  return (
    <Box
      onClick={onClick} sx={{
        display: 'flex',
        flexDirection: 'row',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export default Flex;
