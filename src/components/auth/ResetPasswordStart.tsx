import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import sendRequest, { NonOKStatusCode, resetPasswordUrl } from '../../services/requestService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

type ResetPasswordStartProps = {
  open: boolean;
  close: () => void;
};

const ResetPasswordStart: React.FunctionComponent<ResetPasswordStartProps> = ({
  open,
  close
}: ResetPasswordStartProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>();
  const resetMutation = useMutation(() => sendRequest(resetPasswordUrl, 'POST', { email }), {
    onSuccess: async () => {
      enqueueSnackbar('Sent password reset mail. Check your inbox', { variant: 'success' });
      close();
      return navigate('/');
    },
    onError: (error, variables, context) => {
      let message = '';
      switch ((error as NonOKStatusCode).statusCode) {
        case 404:
          message = `Didn't find account for entered email.`;
          break;
        case 405:
          message = `The email of the account isn't verified.`;
          break;
        default:
          message = 'General server error';
          break;
      }
      enqueueSnackbar(message, { variant: 'error' });
    },
    retry: false
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>{'Reset password?'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You are about to request a password reset url to your registered e-mail address. Your
          e-mail needs to be verified for the request to be sent. If you haven't verified your
          e-mail please contact the support if you can't login.
        </DialogContentText>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="E-Mail"
          name="email"
          autoComplete="email"
          value={email}
          onChange={handleChange}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={resetMutation.isLoading}
          onClick={close}
          autoFocus
          variant="outlined"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          disabled={resetMutation.isLoading}
          onClick={() => {
            resetMutation.mutate();
          }}
          variant="contained"
        >
          {resetMutation.isLoading ? 'Processing...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetPasswordStart;
