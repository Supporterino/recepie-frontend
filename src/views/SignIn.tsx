import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { LoginResponse } from '../types';
import sendRequest, { loginUrl } from '../services/requestService';
import { authenticationManager } from '../services/AuthenticationManager';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PasswordInput from '../components/auth/PasswordInput';

const SignIn: React.FunctionComponent = () => {
  type IFormData = { email: string; password: string };
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>();

  const login: SubmitHandler<IFormData> = async (data: IFormData) => {
    console.log(`Entered user credentials`, data);
    const res = await sendRequest(loginUrl, 'POST', data, true);
    if (res) {
      if (res.status !== 200) {
        retryLogin();
        return;
      }
      const loginData = (await res.json()) as LoginResponse;
      authenticationManager.updateAuthData({
        jwt: loginData.jwtToken,
        refreshToken: loginData.refreshToken,
        userID: loginData.userID,
        jwtExpiry: moment().add(15, 'm').toDate(),
        refreshTokenExpiry: moment().add(7, 'd').toDate()
      });
      enqueueSnackbar('Successfully logged in.', { variant: 'success' });
      navigate('/');
    } else {
      retryLogin();
    }
  };

  const invalidSubmitHandler: SubmitErrorHandler<IFormData> = () => {
    enqueueSnackbar('Missing data in fields.', { variant: 'warning' });
  };

  const retryLogin = () => {
    enqueueSnackbar('Log in failed. Please try again', { variant: 'warning' });
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          paddingTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit(login, invalidSubmitHandler)} sx={{ mt: 1 }}>
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
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link
                onClick={() => {
                  navigate('/register');
                }}
                variant="body2"
              >
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
