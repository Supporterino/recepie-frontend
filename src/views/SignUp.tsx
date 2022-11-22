import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useForm, SubmitHandler } from 'react-hook-form';
import PasswordInput from '../components/auth/PasswordInput';
import sendRequest, { NonOKStatusCode, registerUrl } from '../services/requestService';
import { alignCenterJustifyCenter } from '../components/layout/commonSx';
import Flex from '../components/layout/Flex';
import FlexCol from '../components/layout/FlexCol';
import FlexColContainer from '../components/layout/FlexColContainer';
import { useMutation } from '@tanstack/react-query';

const SignUp: React.FunctionComponent = () => {
  type IFormData = { username: string; email: string; password: string };
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit } = useForm<IFormData>();

  const registerMutation = useMutation(
    (data: IFormData) => sendRequest(registerUrl, 'POST', data),
    {
      onError: (error, variables, context) => {
        switch ((error as NonOKStatusCode).statusCode) {
          case 409:
            alreadyRegistered();
            break;
          default:
            enqueueSnackbar('Registration failed. Please try again', { variant: 'warning' });
            break;
        }
      },
      onSuccess: (data, variables, context) => {
        enqueueSnackbar('Registration successfull.', { variant: 'success' });
        navigate('/login');
      },
      retry: false
    }
  );

  const reg: SubmitHandler<IFormData> = async (data: IFormData) => {
    registerMutation.mutate(data);
  };

  const alreadyRegistered = () => {
    enqueueSnackbar('E-Mail already in use for an account. Please sign in.', {
      variant: 'warning'
    });
    navigate('/login');
  };

  return (
    <FlexColContainer>
      <FlexCol sx={{ pt: 8, ...alignCenterJustifyCenter }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit(reg)} sx={{ mt: 3 }}>
          <TextField
            {...register('username')}
            autoComplete="username"
            name="username"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            autoFocus
          />
          <TextField
            {...register('email')}
            required
            fullWidth
            margin="normal"
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
          />
          <PasswordInput
            formRegister={register('password')}
            name="password"
            label="Password"
            id="password"
            autoComplete="new-password"
          />
          <Button
            disabled={registerMutation.isLoading}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Flex sx={{ width: '100%' }}>
            <Link
              onClick={() => {
                navigate('/login');
              }}
              variant="body2"
            >
              Already have an account? Sign in
            </Link>
          </Flex>
        </Box>
      </FlexCol>
    </FlexColContainer>
  );
};

export default SignUp;
