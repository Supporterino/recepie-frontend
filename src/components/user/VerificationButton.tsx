import { Button } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import useLoggedIn from '../../hooks/useLoggedIn';
import { authenticationManager } from '../../services/AuthenticationManager';
import { getUser } from '../../services/requests';
import sendRequest, { startVerifyUrl } from '../../services/requestService';
import { User } from '../../types';
import ErrorDisplay from '../queryUtils/ErrorText';

const VerificationButton: React.FunctionComponent = () => {
  const loggedIn = useLoggedIn();
  const userID = useRef<string>();
  const { enqueueSnackbar } = useSnackbar();
  const [enabled, setEnabled] = useState<boolean>(loggedIn);
  const {
    isError,
    error,
    isFetching,
    data: user
  } = useQuery<User>(['users', userID], () => getUser(userID.current!), {
    enabled: !!userID.current
  });

  useEffect(() => {
    if (loggedIn) {
      userID.current = authenticationManager.getUserID();
      setEnabled(true);
    } else setEnabled(false);
  }, [loggedIn]);

  const verificationStartMutation = useMutation(() => sendRequest(startVerifyUrl, 'GET'), {
    onSuccess: async () => {
      enqueueSnackbar('Verification started. Check your mail', { variant: 'success' });
    },
    onError: (error, variables, context) => {
      enqueueSnackbar('Failed to start email verification', { variant: 'error' });
    }
  });

  if (isError) return <ErrorDisplay text={`${error}`} />;

  return (
    <Button
      disabled={!enabled || (user && user.verified)}
      sx={{ my: 1 }}
      onClick={() => verificationStartMutation.mutate()}
      variant="contained"
    >
      {isFetching && 'Prefetching your user...'}
      {user && user.verified && 'Already verified'}
      {user && !user.verified && 'Start verification'}
      {verificationStartMutation.isLoading && 'Sending request...'}
      {!user && !isFetching && !verificationStartMutation.isLoading && '-'}
    </Button>
  );
};

export default VerificationButton;
