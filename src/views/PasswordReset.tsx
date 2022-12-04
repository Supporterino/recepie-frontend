import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import PasswordInput from '../components/auth/PasswordInput';
import FlexColContainer from '../components/layout/FlexColContainer';
import FlexCol from '../components/layout/FlexCol';
import { alignCenterJustifyCenter } from '../components/layout/commonSx';
import useQuery from '../hooks/useQuery';
import { useMutation } from '@tanstack/react-query';
import sendRequest, { completePasswordResetUrl } from '../services/requestService';
import { useTranslation } from 'react-i18next';

const PasswordReset: React.FunctionComponent = () => {
  type IFormData = { password1: string; password2: string };
  const query = useQuery();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit } = useForm<IFormData>({ mode: 'onChange' });
  const { t } = useTranslation(['passwordReset', 'common']);

  const resetMutation = useMutation(
    (data: IFormData) =>
      sendRequest(completePasswordResetUrl, 'POST', {
        userID: query.get('id'),
        token: query.get('token'),
        newPassword: data.password1
      }),
    {
      onError: (error, variables, context) => {
        enqueueSnackbar(t('passwordReset:snackbar.error'), { variant: 'error' });
      },
      onSuccess: (data, variables, context) => {
        enqueueSnackbar(t('passwordReset:snackbar.success'), { variant: 'success' });
        navigate('/login');
      },
      retry: false
    }
  );

  const resetPassword: SubmitHandler<IFormData> = async (data: IFormData) => {
    resetMutation.mutate(data);
  };

  return (
    <FlexColContainer>
      <FlexCol sx={{ pt: 8, ...alignCenterJustifyCenter }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Set new password
        </Typography>
        <Box component="form" onSubmit={handleSubmit(resetPassword)} sx={{ mt: 1 }}>
          <PasswordInput
            formRegister={register('password1', { required: true })}
            name="password"
            label={t('passwordReset:formFields.password')}
            id="password"
            autoComplete="current-password"
          />
          <PasswordInput
            formRegister={register('password2', { required: true })}
            name="password"
            label={t('passwordReset:formFields.repeatPassword')}
            id="password"
            autoComplete="current-password"
          />
          <Button
            disabled={resetMutation.isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {!resetMutation.isLoading && t('common:buttons.submit')}
            {resetMutation.isLoading && t('common:buttons.pending')}
          </Button>
        </Box>
      </FlexCol>
    </FlexColContainer>
  );
};

export default PasswordReset;
