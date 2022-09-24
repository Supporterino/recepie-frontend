import { Box } from '@mui/material';

type FlexBoxProps = {
  children?: React.ReactNode;
  sx?: {};
};

const Flex: React.FunctionComponent<FlexBoxProps> = ({ children, sx }: FlexBoxProps) => {
  return <Box sx={{ display: 'flex', flexDirection: 'row', ...sx }}>{children}</Box>;
};

export default Flex;
