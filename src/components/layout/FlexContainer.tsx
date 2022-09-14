import { Container } from '@mui/material';

type FlexBoxProps = {
  children?: React.ReactNode;
};

const FlexBox: React.FunctionComponent<FlexBoxProps> = ({ children }: FlexBoxProps) => {
  return (
    <Container sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
    </Container>
  );
};

export default FlexBox;
