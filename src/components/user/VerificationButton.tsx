import { Button } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('settings');
    const [enabled, setEnabled] = useState<boolean>(loggedIn);
    const {
        isError,
        error,
        isFetching,
        data: user,
    } = useQuery<User>(['users', userID], () => getUser(userID.current!), {
        enabled: !!userID.current,
    });

    useEffect(() => {
        if (loggedIn) {
            userID.current = authenticationManager.getUserID();
            setEnabled(true);
        } else setEnabled(false);
    }, [loggedIn]);

    const verificationStartMutation = useMutation(() => sendRequest(startVerifyUrl, 'GET'), {
        onSuccess: async () => {
            enqueueSnackbar(t('verification.startEmail'), { variant: 'success' });
        },
        onError: (error, variables, context) => {
            enqueueSnackbar(t('verification.failedEmail'), { variant: 'error' });
        },
    });

    if (isError) return <ErrorDisplay text={`${error}`} />;

    return (
        <Button
            disabled={!enabled || (user && user.verified)}
            sx={{ my: 1 }}
            onClick={() => verificationStartMutation.mutate()}
            variant="contained"
        >
            {isFetching && t('verification.fetching')}
            {user && user.verified && t('verification.verified')}
            {user && !user.verified && t('verification.unverified')}
            {verificationStartMutation.isLoading && t('verification.pending')}
            {!user && !isFetching && !verificationStartMutation.isLoading && t('verification.none')}
        </Button>
    );
};

export default VerificationButton;
