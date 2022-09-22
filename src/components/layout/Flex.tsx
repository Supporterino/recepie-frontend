import { Box } from '@mui/material';

type FlexBoxProps = {
  children?: React.ReactNode;
};

const Flex: React.FunctionComponent<FlexBoxProps> = ({ children }: FlexBoxProps) => {
  return <Box sx={{ display: 'flex', flexDirection: 'row' }}>{children}</Box>;
};

export default Flex;
