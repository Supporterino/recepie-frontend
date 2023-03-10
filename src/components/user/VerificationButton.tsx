import useLoggedIn from '../../hooks/useLoggedIn';
import {
  authenticationManager,
} from '../../services/AuthenticationManager';
import {
  getUser,
} from '../../services/requests';
import sendRequest, {
  startVerifyUrl,
} from '../../services/sendRequest';
import {
  type User,
} from '../../types';
import ErrorDisplay from '../queryUtils/ErrorDisplay';
import {
  Button,
} from '@mui/material';
import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

const VerificationButton: React.FunctionComponent = () => {
  const loggedIn = useLoggedIn();
  const userID = useRef<string>();
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const {
    t,
  } = useTranslation('settings');
  const [
    enabled,
    setEnabled,
  ] = useState<boolean>(loggedIn);
  const {
    isError,
    error,
    isFetching,
    data: user,
  } = useQuery<User>([
    'users',
    userID,
  ], () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return getUser(userID.current!);
  }, {
    enabled: Boolean(userID.current),
  });

  useEffect(() => {
    if (loggedIn) {
      userID.current = authenticationManager.getUserID();
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [
    loggedIn,
  ]);

  const verificationStartMutation = useMutation(() => {
    return sendRequest(startVerifyUrl, 'GET');
  }, {
    onError: () => {
      enqueueSnackbar(t('verification.failedEmail'), {
        variant: 'error',
      });
    },
    onSuccess: async () => {
      enqueueSnackbar(t('verification.startEmail'), {
        variant: 'success',
      });
    },
  });

  if (isError) {
    return <ErrorDisplay text={`${error}`} />;
  }

  return (
    <Button
      disabled={!enabled || user?.verified}
      onClick={() => {
        return verificationStartMutation.mutate();
      }}
      sx={{
        my: 1,
      }}
      variant='contained'
    >
      {isFetching && t('verification.fetching')}
      {user?.verified && t('verification.verified')}
      {user && !user.verified && t('verification.unverified')}
      {verificationStartMutation.isLoading && t('verification.pending')}
      {!user && !isFetching && !verificationStartMutation.isLoading && t('verification.none')}
    </Button>
  );
};

export default VerificationButton;
