import { Alert, AlertTitle, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

type ErrorDisplayProps = {
    text: string;
};

const ErrorDisplay: React.FunctionComponent<ErrorDisplayProps> = ({ text }: ErrorDisplayProps) => {
    const { t } = useTranslation(['common']);
    return (
        <Container sx={{ flexGrow: 1 }}>
            <Alert sx={{ my: 3 }} severity="error">
                <AlertTitle>{t('common:errorDisplay.title')}</AlertTitle>
                {t('common:errorDisplay.text') + text}
            </Alert>
        </Container>
    );
};

export default ErrorDisplay;
