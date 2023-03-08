import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import sendRequest, { NonOKStatusCode, resetPasswordUrl } from '../../services/requestService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type ResetPasswordStartProps = {
    open: boolean;
    close: () => void;
};

const ResetPasswordStart: React.FunctionComponent<ResetPasswordStartProps> = ({ open, close }: ResetPasswordStartProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>();
    const { t } = useTranslation(['signin', 'common']);
    const resetMutation = useMutation(() => sendRequest(resetPasswordUrl, 'POST', { email }), {
        onSuccess: async () => {
            enqueueSnackbar(t('signin:snackbar.successReset'), { variant: 'success' });
            close();
            return navigate('/');
        },
        onError: (error, variables, context) => {
            let message = '';
            switch ((error as NonOKStatusCode).statusCode) {
                case 404:
                    message = t('signin:snackbar.wrongMail');
                    break;
                case 405:
                    message = t('signin:snackbar.unverified');
                    break;
                default:
                    message = t('signin:snackbar.error');
                    break;
            }
            enqueueSnackbar(message, { variant: 'error' });
        },
        retry: false,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    return (
        <Dialog open={open} onClose={close}>
            <DialogTitle>{t('signin:resetDialog.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t('signin:resetDialog.text')}</DialogContentText>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={t('signin:formFields.email')}
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={handleChange}
                    autoFocus
                />
            </DialogContent>
            <DialogActions>
                <Button disabled={resetMutation.isLoading} onClick={close} autoFocus variant="outlined" color="secondary">
                    {t('common:buttons.cancel')}
                </Button>
                <Button
                    disabled={resetMutation.isLoading}
                    onClick={() => {
                        resetMutation.mutate();
                    }}
                    variant="contained"
                >
                    {resetMutation.isLoading ? t('common:buttons.pending') : t('common:buttons.submit')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResetPasswordStart;
