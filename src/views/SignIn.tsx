import PasswordInput from '../components/auth/PasswordInput';
import ResetPasswordStart from '../components/auth/ResetPasswordStart';
import {
  alignCenterJustifyCenter,
} from '../components/layout/commonSx';
import Flex from '../components/layout/Flex';
import FlexCol from '../components/layout/FlexCol';
import FlexColContainer from '../components/layout/FlexColContainer';
import {
  authenticationManager,
} from '../services/AuthenticationManager';
import sendRequest, {
  loginUrl,
} from '../services/sendRequest';
import {
  type LoginResponse,
} from '../types';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  useMutation,
} from '@tanstack/react-query';
import moment from 'moment';
import {
  useSnackbar,
} from 'notistack';
import * as React from 'react';
import {
  useState,
} from 'react';
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

const SignIn: React.FunctionComponent = () => {
    type IFormData = { email: string, password: string, };
    const navigate = useNavigate();
    const {
      enqueueSnackbar,
    } = useSnackbar();
    const {
      register,
      handleSubmit,
    } = useForm<IFormData>();
    const [
      resetOpen,
      setResetOpen,
    ] = useState<boolean>(false);
    const {
      t,
    } = useTranslation('signin');

    const loginMutation = useMutation((data: IFormData) => {
      return sendRequest(loginUrl, 'POST', data);
    }, {
      onError: () => {
        enqueueSnackbar(t('snackbar.failed'), {
          variant: 'warning',
        });
      },
      onSuccess: async (data) => {
        const loginData = (await data.json()) as LoginResponse;
        authenticationManager.updateAuthData({
          jwt: loginData.jwtToken,
          jwtExpiry: moment().add(15, 'm').toDate(),
          refreshToken: loginData.refreshToken,
          refreshTokenExpiry: moment().add(7, 'd').toDate(),
          userID: loginData.userID,
        });
        enqueueSnackbar(t('snackbar.success'), {
          variant: 'success',
        });
        navigate('/');
      },
      retry: false,
    });

    const login: SubmitHandler<IFormData> = async (data: IFormData) => {
      loginMutation.mutate(data);
    };

    return (
      <FlexColContainer>
        <ResetPasswordStart
          close={() => {
            return setResetOpen(false);
          }} open={resetOpen}
        />
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
            {t('title')}
          </Typography>
          <Box
            component='form' onSubmit={handleSubmit(login)} sx={{
              mt: 1,
            }}
          >
            <TextField
              {...register('email')}
              autoComplete='email'
              autoFocus
              fullWidth
              id='email'
              label={t('formFields.email')}
              margin='normal'
              name='email'
              required
            />
            <PasswordInput
              autoComplete='current-password'
              formRegister={register('password')}
              id='password'
              label={t('formFields.password')}
              name='password'
            />
            <Button
              fullWidth sx={{
                mb: 2,
                mt: 3,
              }} type='submit'
              variant='contained'
            >
              {t('buttons.signin')}
            </Button>
            <Flex sx={{
              width: '100%',
            }}
            >
              <Link
                onClick={() => {
                  return setResetOpen(true);
                }} sx={{
                  flexGrow: 1,
                }} variant='body2'
              >
                {t('buttons.forgot')}
              </Link>
              <Link
                onClick={() => {
                  navigate('/register');
                }}
                variant='body2'
              >
                {t('buttons.signup')}
              </Link>
            </Flex>
          </Box>
        </FlexCol>
      </FlexColContainer>
    );
};

export default SignIn;
