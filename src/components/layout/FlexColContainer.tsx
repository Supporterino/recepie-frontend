import { Container } from '@mui/material';

type FlexBoxProps = {
  children?: React.ReactNode;
  sx?: {};
};

const FlexColContainer: React.FunctionComponent<FlexBoxProps> = ({
  children,
  sx
}: FlexBoxProps) => {
  return (
    <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column', ...sx }}>
      {children}
    </Container>
  );
};

export default FlexColContainer;
