import PasswordInput from '../components/auth/PasswordInput';
import {
  alignCenterJustifyCenter,
} from '../components/layout/commonSx';
import Flex from '../components/layout/Flex';
import FlexCol from '../components/layout/FlexCol';
import FlexColContainer from '../components/layout/FlexColContainer';
import {
  type NonOKStatusCode,
} from '../services/sendRequest';
import sendRequest, {
  registerUrl,
} from '../services/sendRequest';
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

const SignUp: React.FunctionComponent = () => {
    type IFormData = { email: string, password: string, username: string, };
    const navigate = useNavigate();
    const {
      enqueueSnackbar,
    } = useSnackbar();
    const {
      register,
      handleSubmit,
    } = useForm<IFormData>();
    const {
      t,
    } = useTranslation('signup');

    const alreadyRegistered = () => {
      enqueueSnackbar(t('snackbar.mailTaken'), {
        variant: 'warning',
      });
      navigate('/login');
    };

    const registerMutation = useMutation((data: IFormData) => {
      return sendRequest(registerUrl, 'POST', data);
    }, {
      onError: (error) => {
        switch ((error as NonOKStatusCode).statusCode) {
          case 409:
            alreadyRegistered();
            break;
          default:
            enqueueSnackbar(t('snackbar.error'), {
              variant: 'warning',
            });
            break;
        }
      },
      onSuccess: () => {
        enqueueSnackbar(t('snackbar.success'), {
          variant: 'success',
        });
        navigate('/login');
      },
      retry: false,
    });

    const reg: SubmitHandler<IFormData> = async (data: IFormData) => {
      registerMutation.mutate(data);
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
            Sign in
          </Typography>
          <Box
            component='form' onSubmit={handleSubmit(reg)} sx={{
              mt: 3,
            }}
          >
            <TextField
              {...register('username')}
              autoComplete='username'
              autoFocus
              fullWidth
              id='username'
              label={t('formFields.username')}
              margin='normal'
              name='username'
              required
            />
            <TextField
              {...register('email')}
              autoComplete='email'
              fullWidth
              id='email'
              label={t('formFields.email')}
              margin='normal'
              name='email'
              required
            />
            <PasswordInput
              autoComplete='new-password'
              formRegister={register('password')}
              id='password'
              label={t('formFields.password')}
              name='password'
            />
            <Button
              disabled={registerMutation.isLoading} fullWidth sx={{
                mb: 2,
                mt: 3,
              }}
              type='submit' variant='contained'
            >
              {t('buttons.signup')}
            </Button>
            <Flex sx={{
              width: '100%',
            }}
            >
              <Link
                onClick={() => {
                  navigate('/login');
                }}
                variant='body2'
              >
                {t('buttons.signin')}
              </Link>
            </Flex>
          </Box>
        </FlexCol>
      </FlexColContainer>
    );
};

export default SignUp;
