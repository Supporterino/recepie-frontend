import { Box } from '@mui/material';

type FlexBoxProps = {
  children?: React.ReactNode;
  sx?: {};
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
};

const Flex: React.FunctionComponent<FlexBoxProps> = ({ children, sx, onClick }: FlexBoxProps) => {
  return (
    <Box onClick={onClick} sx={{ display: 'flex', flexDirection: 'row', ...sx }}>
      {children}
    </Box>
  );
};

export default Flex;
