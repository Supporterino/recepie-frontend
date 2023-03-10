import PasswordInput from '../components/auth/PasswordInput';
import {
  alignCenterJustifyCenter,
} from '../components/layout/commonSx';
import FlexCol from '../components/layout/FlexCol';
import FlexColContainer from '../components/layout/FlexColContainer';
import useQuery from '../hooks/useQuery';
import sendRequest, {
  completePasswordResetUrl,
} from '../services/sendRequest';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  useMutation,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import * as React from 'react';
import {
  type SubmitHandler,
} from 'react-hook-form';
import {
  useForm,
} from 'react-hook-form';
import {
  useTranslation,
} from 'react-i18next';
import {
  useNavigate,
} from 'react-router-dom';

const PasswordReset: React.FunctionComponent = () => {
    type IFormData = { password1: string, password2: string, };
    const query = useQuery();
    const navigate = useNavigate();
    const {
      enqueueSnackbar,
    } = useSnackbar();
    const {
      register,
      handleSubmit,
    } = useForm<IFormData>({
      mode: 'onChange',
    });
    const {
      t,
    } = useTranslation([
      'passwordReset',
      'common',
    ]);

    const resetMutation = useMutation(
      (data: IFormData) => {
        return sendRequest(completePasswordResetUrl, 'POST', {
          newPassword: data.password1,
          token: query.get('token'),
          userID: query.get('id'),
        });
      },
      {
        onError: () => {
          enqueueSnackbar(t('passwordReset:snackbar.error'), {
            variant: 'error',
          });
        },
        onSuccess: () => {
          enqueueSnackbar(t('passwordReset:snackbar.success'), {
            variant: 'success',
          });
          navigate('/login');
        },
        retry: false,
      },
    );

    const resetPassword: SubmitHandler<IFormData> = async (data: IFormData) => {
      resetMutation.mutate(data);
    };

    return (
      <FlexColContainer>
        <FlexCol sx={{
          pt: 8,
          ...alignCenterJustifyCenter,
        }}
        >
          <Avatar sx={{
            bgcolor: 'secondary.main',
            m: 1,
          }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Set new password
          </Typography>
          <Box
            component='form' onSubmit={handleSubmit(resetPassword)} sx={{
              mt: 1,
            }}
          >
            <PasswordInput
              autoComplete='current-password'
              formRegister={register('password1', {
                required: true,
              })}
              id='password'
              label={t('passwordReset:formFields.password')}
              name='password'
            />
            <PasswordInput
              autoComplete='current-password'
              formRegister={register('password2', {
                required: true,
              })}
              id='password'
              label={t('passwordReset:formFields.repeatPassword')}
              name='password'
            />
            <Button
              disabled={resetMutation.isLoading} fullWidth sx={{
                mb: 2,
                mt: 3,
              }}
              type='submit' variant='contained'
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
