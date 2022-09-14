import { Alert, AlertTitle, Container } from '@mui/material';

type ErrorDisplayProps = {
  text: string;
};

const ErrorDisplay: React.FunctionComponent<ErrorDisplayProps> = ({ text }: ErrorDisplayProps) => {
  return (
    <Container sx={{ flexGrow: 1 }}>
      <Alert sx={{ my: 3 }} severity="error">
        <AlertTitle>Error</AlertTitle>
        Failed to load ressources with error — {text}
      </Alert>
    </Container>
  );
};

export default ErrorDisplay;
