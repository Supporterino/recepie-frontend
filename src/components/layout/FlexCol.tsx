import { Box } from '@mui/material';

type FlexBoxProps = {
  children?: React.ReactNode;
  sx?: {};
};

const FlexCol: React.FunctionComponent<FlexBoxProps> = ({ children, sx }: FlexBoxProps) => {
  return <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>{children}</Box>;
};

export default FlexCol;
