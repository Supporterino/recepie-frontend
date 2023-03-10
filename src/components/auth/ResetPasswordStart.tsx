import {
  type NonOKStatusCode,
} from '../../services/sendRequest';
import sendRequest, {
  resetPasswordUrl,
} from '../../services/sendRequest';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import {
  useMutation,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import {
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';
import {
  useNavigate,
} from 'react-router-dom';

type ResetPasswordStartProps = {
  close: () => void,
  open: boolean,
};

const ResetPasswordStart: React.FunctionComponent<ResetPasswordStartProps> = ({
  open,
  close,
}: ResetPasswordStartProps) => {
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const navigate = useNavigate();
  const [
    email,
    setEmail,
  ] = useState<string>();
  const {
    t,
  } = useTranslation([
    'signin',
    'common',
  ]);
  const resetMutation = useMutation(() => {
    return sendRequest(resetPasswordUrl, 'POST', {
      email,
    });
  }, {
    onError: (error) => {
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

      enqueueSnackbar(message, {
        variant: 'error',
      });
    },
    onSuccess: async () => {
      enqueueSnackbar(t('signin:snackbar.successReset'), {
        variant: 'success',
      });
      close();
      return navigate('/');
    },
    retry: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <Dialog onClose={close} open={open}>
      <DialogTitle>{t('signin:resetDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('signin:resetDialog.text')}</DialogContentText>
        <TextField
          autoComplete='email'
          autoFocus
          fullWidth
          id='email'
          label={t('signin:formFields.email')}
          margin='normal'
          name='email'
          onChange={handleChange}
          required
          value={email}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus color='secondary' disabled={resetMutation.isLoading} onClick={close} variant='outlined'>
          {t('common:buttons.cancel')}
        </Button>
        <Button
          disabled={resetMutation.isLoading}
          onClick={() => {
            resetMutation.mutate();
          }}
          variant='contained'
        >
          {resetMutation.isLoading ? t('common:buttons.pending') : t('common:buttons.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordStart;
