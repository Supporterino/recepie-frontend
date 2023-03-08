import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

type PasswordInputProps = {
    label: string;
    name: string;
    autoComplete: string;
    id: string;
    formRegister: UseFormRegisterReturn;
    error?: boolean;
    errorText?: string;
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
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            {...formRegister}
            label={label}
            name={name}
            autoComplete={autoComplete}
            id={id}
            error={error}
            helperText={error ? errorText : undefined}
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            required
            fullWidth
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default PasswordInput;
