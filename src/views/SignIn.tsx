import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginResponse } from '../types';
import sendRequest, { loginUrl } from '../services/requestService';
import { authenticationManager } from '../services/AuthenticationManager';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PasswordInput from '../components/auth/PasswordInput';
import FlexColContainer from '../components/layout/FlexColContainer';
import FlexCol from '../components/layout/FlexCol';
import { alignCenterJustifyCenter } from '../components/layout/commonSx';
import Flex from '../components/layout/Flex';
import ResetPasswordStart from '../components/auth/ResetPasswordStart';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

const SignIn: React.FunctionComponent = () => {
  type IFormData = { email: string; password: string };
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit } = useForm<IFormData>();
  const [resetOpen, setResetOpen] = useState<boolean>(false);

  const loginMutation = useMutation((data: IFormData) => sendRequest(loginUrl, 'POST', data), {
    onSuccess: (data, variables, context) => {
      const loginData = data as unknown as LoginResponse;
      authenticationManager.updateAuthData({
        jwt: loginData.jwtToken,
        refreshToken: loginData.refreshToken,
        userID: loginData.userID,
        jwtExpiry: moment().add(15, 'm').toDate(),
        refreshTokenExpiry: moment().add(7, 'd').toDate()
      });
      enqueueSnackbar('Successfully logged in.', { variant: 'success' });
      navigate('/');
    },
    onError: (error, variables, context) => {
      enqueueSnackbar('Log in failed. Please try again', { variant: 'warning' });
    },
    retry: false
  });

  const login: SubmitHandler<IFormData> = async (data: IFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <FlexColContainer>
      <ResetPasswordStart open={resetOpen} close={() => setResetOpen(false)} />
      <FlexCol sx={{ pt: 8, ...alignCenterJustifyCenter }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit(login)} sx={{ mt: 1 }}>
          <TextField
            {...register('email')}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <PasswordInput
            formRegister={register('password')}
            name="password"
            label="Password"
            id="password"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Flex sx={{ width: '100%' }}>
            <Link onClick={() => setResetOpen(true)} variant="body2" sx={{ flexGrow: 1 }}>
              Forgot password?
            </Link>
            <Link
              onClick={() => {
                navigate('/register');
              }}
              variant="body2"
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Flex>
        </Box>
      </FlexCol>
    </FlexColContainer>
  );
};

export default SignIn;
