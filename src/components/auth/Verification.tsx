import useQuery from '../../hooks/useQuery';
import sendRequest, {
  completeVerifyUrl,
} from '../../services/sendRequest';
import {
  alignCenterJustifyCenter,
} from '../layout/commonSx';
import FlexCol from '../layout/FlexCol';
import FlexColContainer from '../layout/FlexColContainer';
import ErrorDisplay from '../queryUtils/ErrorDisplay';
import Loader from '../queryUtils/Loader';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import {
  useMutation,
} from '@tanstack/react-query';
import {
  useEffect,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';
import {
  useNavigate,
} from 'react-router-dom';

const Verification: React.FunctionComponent = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const {
    t,
  } = useTranslation('verification');

  const completeVerifyMutation = useMutation(
    () => {
      return sendRequest(completeVerifyUrl, 'POST', {
        token: query.get('token'),
        userID: query.get('userID'),
      });
    },
    {
      retry: false,
    },
  );

  useEffect(() => {
    completeVerifyMutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlexColContainer>
      {completeVerifyMutation.isLoading && <Loader text={t('loading').toString()} />}
      {completeVerifyMutation.isError && <ErrorDisplay text={`${completeVerifyMutation.error}`} />}
      {completeVerifyMutation.isSuccess &&
      <FlexCol sx={{
        flexGrow: 1,
        ...alignCenterJustifyCenter,
      }}
      >
        <Box
          sx={{
            backgroundColor: (theme) => {
              return theme.palette.background.default;
            },
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            ...alignCenterJustifyCenter,
          }}
        >
          <CheckCircleIcon sx={{
            fontSize: 60,
          }}
          />
          <Typography>{t('success')}</Typography>
          <Button onClick={() => {
            return navigate('/', {
              replace: true,
            });
          }}
          >{t('home')}</Button>
        </Box>
      </FlexCol>}
    </FlexColContainer>
  );
};

export default Verification;
