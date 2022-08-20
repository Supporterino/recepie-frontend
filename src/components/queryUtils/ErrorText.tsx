import { Alert, AlertTitle, Container } from '@mui/material';

type ErrorDisplayProps = {
  text: string;
};

const ErrorDisplay: React.FunctionComponent<ErrorDisplayProps> = ({ text }: ErrorDisplayProps) => {
  return (
    <Container>
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        Failed to load ressources with error — {text}
      </Alert>
    </Container>
  );
};

export default ErrorDisplay;
