import { Box, Button, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';
import sendRequest, { completeVerifyUrl } from '../../services/requestService';
import { alignCenterJustifyCenter } from '../layout/commonSx';
import FlexCol from '../layout/FlexCol';
import FlexColContainer from '../layout/FlexColContainer';
import ErrorDisplay from '../queryUtils/ErrorText';
import Loader from '../queryUtils/Loader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';

const Verification: React.FunctionComponent = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { t } = useTranslation('verification');

  const completeVerifyMutation = useMutation(
    () =>
      sendRequest(completeVerifyUrl, 'POST', {
        userID: query.get('userID'),
        token: query.get('token')
      }),
    { retry: false }
  );

  useEffect(() => {
    completeVerifyMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlexColContainer>
      {completeVerifyMutation.isLoading && <Loader text={t('loading')} />}
      {completeVerifyMutation.isError && <ErrorDisplay text={`${completeVerifyMutation.error}`} />}
      {completeVerifyMutation.isSuccess && (
        <FlexCol sx={{ flexGrow: 1, ...alignCenterJustifyCenter }}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.background.default,
              borderRadius: 4,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              ...alignCenterJustifyCenter
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 60 }} />
            <Typography>{t('success')}</Typography>
            <Button onClick={() => navigate('/', { replace: true })}>{t('home')}</Button>
          </Box>
        </FlexCol>
      )}
    </FlexColContainer>
  );
};

export default Verification;
