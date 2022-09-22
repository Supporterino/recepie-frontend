import { Box } from '@mui/material';

type FlexBoxProps = {
  children?: React.ReactNode;
};

const FlexCol: React.FunctionComponent<FlexBoxProps> = ({ children }: FlexBoxProps) => {
  return <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>{children}</Box>;
};

export default FlexCol;
