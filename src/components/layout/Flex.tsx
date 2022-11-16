import { Box, SxProps, Theme } from '@mui/material';

type FlexProps = {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

const Flex: React.FunctionComponent<FlexProps> = ({ children, sx, onClick }: FlexProps) => {
  return (
    <Box onClick={onClick} sx={{ display: 'flex', flexDirection: 'row', ...sx }}>
      {children}
    </Box>
  );
};

export default Flex;
