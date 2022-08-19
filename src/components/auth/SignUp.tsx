import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useForm, SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import sendRequest, { registerUrl } from '../../services/requestService';
import { LoginResponse } from '../../types';
import PasswordInput from './PasswordInput';

const SignUp: React.FunctionComponent = () => {
  type IFormData = { username: string, email: string; password: string };
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormData>();

  const reg: SubmitHandler<IFormData> = async (data: IFormData) => {
    console.log(`Entered user credentials`, data);
    const res = await sendRequest(registerUrl, 'POST', data, true);
    if (res) {
      if (res.status === 409) {alreadyRegistered(); return;}
      if (res.status !== 200) {retryRegister(); return;}
      enqueueSnackbar('Registration successfull.', { variant: 'success' })
      navigate('/login')
    } else {
      retryRegister()
    }
  };

  const invalidSubmitHandler: SubmitErrorHandler<IFormData> = () => {
    enqueueSnackbar('Missing data in fields.', { variant: 'warning' })
  }

  const retryRegister = () => {
    enqueueSnackbar('Registration failed. Please try again', { variant: 'warning' })
    navigate('/register')
  }

  const alreadyRegistered = () => {
    enqueueSnackbar('E-Mail already in use for an account. Please sign in.', { variant: 'warning' })
    navigate('/login')
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleSubmit(reg, invalidSubmitHandler)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs={12}>
              <PasswordInput
                formRegister={register('password')}
                name="password"
                label="Password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              {/* <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              /> */}
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                onClick={() => {
                  navigate('/login');
                }}
                variant="body2"
              >
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp