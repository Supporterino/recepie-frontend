import { Box, SxProps, Theme } from '@mui/material';

type FlexColProps = {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
};

const FlexCol: React.FunctionComponent<FlexColProps> = ({ children, sx }: FlexColProps) => {
  return <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>{children}</Box>;
};

export default FlexCol;
