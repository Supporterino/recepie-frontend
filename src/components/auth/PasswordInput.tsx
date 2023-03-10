import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import {
  useState,
} from 'react';
import {
  type UseFormRegisterReturn,
} from 'react-hook-form';

type PasswordInputProps = {
  autoComplete: string,
  error?: boolean,
  errorText?: string,
  formRegister: UseFormRegisterReturn,
  id: string,
  label: string,
  name: string,
};

const PasswordInput: React.FunctionComponent<PasswordInputProps> = ({
  label,
  name,
  autoComplete,
  id,
  formRegister,
  error,
  errorText,
}: PasswordInputProps) => {
  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  return (
    <TextField
      {...formRegister}
      InputProps={{
        endAdornment:
  <InputAdornment position='end'>
    <IconButton
      aria-label='toggle password visibility'
      onClick={() => {
        return setShowPassword(!showPassword);
      }}
      onMouseDown={() => {
        return setShowPassword(!showPassword);
      }}
    >
      {showPassword ? <Visibility /> : <VisibilityOff />}
    </IconButton>
  </InputAdornment>
        ,
      }}
      autoComplete={autoComplete}
      error={error}
      fullWidth
      helperText={error ? errorText : undefined}
      id={id}
      label={label}
      margin='normal'
      name={name}
      required
      type={showPassword ? 'text' : 'password'}
    />
  );
};

export default PasswordInput;
