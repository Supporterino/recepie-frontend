import { Container } from '@mui/material';

type FlexBoxProps = {
  children?: React.ReactNode;
};

const FlexColContainer: React.FunctionComponent<FlexBoxProps> = ({ children }: FlexBoxProps) => {
  return (
    <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {children}
    </Container>
  );
};

export default FlexColContainer;
