import ImageUpload from '../components/createSteps/ImageUpload';
import {
  alignCenterJustifyCenter,
  alignStartJustifyCenter,
} from '../components/layout/commonSx';
import Flex from '../components/layout/Flex';
import FlexCol from '../components/layout/FlexCol';
import FlexColContainer from '../components/layout/FlexColContainer';
import ListOverview from '../components/listViews/ListOverview';
import ErrorDisplay from '../components/queryUtils/ErrorDisplay';
import Loader from '../components/queryUtils/Loader';
import UserImage from '../components/user/UserImage';
import {
  authenticationManager,
} from '../services/AuthenticationManager';
import {
  getOwnRecipes,
  getUser,
} from '../services/requests';
import {
  type Recipe,
  type Role,
  type RoleType,
  type User,
} from '../types';
import {
  getRoleKeyName,
  PhotoTypes,
} from '../types';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GppBadIcon from '@mui/icons-material/GppBad';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  Typography,
} from '@mui/material';
import {
  useQuery,
} from '@tanstack/react-query';
import {
  type ReactNode,
} from 'react';
import {
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';

const UserSite: React.FunctionComponent = () => {
  const userID = authenticationManager.getUserID();
  const {
    t,
  } = useTranslation([
    'user',
    'lists',
  ]);
  const {
    isLoading,
    isError,
    error,
    data: user,
  } = useQuery<User>([
    'users',
    userID,
  ], () => {
    return getUser(userID);
  });

  const ownRecipesQuery = useQuery<Recipe[]>([
    'ownRecipes',
  ], getOwnRecipes);
  const [
    uploadOpen,
    setUploadOpen,
  ] = useState<boolean>(false);

  const getRoleNode = (role: Role): ReactNode => {
    const roleString = getRoleKeyName(role);

    return (
      <Flex sx={{
        mb: 0.25,
        ...alignCenterJustifyCenter,
      }}
      >
        <AdminPanelSettingsIcon color={role > 1 ? 'error' : 'secondary'} fontSize='small' />
        <Typography
          color={role > 1 ? 'error' : 'secondary'} sx={{
            ml: 0.5,
          }}
        >
          {t(`user:roles.${roleString as RoleType}` as const)}
        </Typography>
      </Flex>
    );
  };

  const getVerifyNode = (verified: boolean): ReactNode => {
    return (
      <Flex sx={alignCenterJustifyCenter}>
        {verified ? <VerifiedUserIcon fontSize='small' /> : <GppBadIcon fontSize='small' />}
        {verified ?
          <Typography sx={{
            ml: 0.5,
          }}
          >{t('user:verified')}</Typography> :
          <Typography sx={{
            ml: 0.5,
          }}
          >{t('user:unverified')}</Typography>}
      </Flex>
    );
  };

  if (isLoading) {
    return (
      <FlexColContainer>
        <Loader />
      </FlexColContainer>
    );
  }

  if (isError) {
    return (
      <FlexColContainer>
        <ErrorDisplay text={`${error}`} />
      </FlexColContainer>
    );
  }

  return (
    <FlexColContainer>
      <Flex sx={alignCenterJustifyCenter}>
        <UserImage
          height='150px'
          onClick={() => {
            return setUploadOpen(true);
          }}
          round
          sx={{
            mr: 5,
          }}
          url={`${user.avatar === '' ? 'images/no-pictures.png' : user.avatar}`}
          width='150px'
        />
        <FlexCol sx={alignStartJustifyCenter}>
          <Typography
            sx={{
              mb: 0.5,
            }} variant='h5'
          >
            {user.username}
          </Typography>
          <Flex sx={{
            mb: 0.25,
            ...alignCenterJustifyCenter,
          }}
          >
            <CalendarMonthIcon fontSize='small' />
            <Typography sx={{
              ml: 0.5,
            }}
            >{new Date(user.joinedAt).toLocaleDateString()}</Typography>
          </Flex>
          {getRoleNode(user.role)}
          {getVerifyNode(user.verified)}
        </FlexCol>
      </Flex>
      <ImageUpload
        close={() => {
          setUploadOpen(false);
        }}
        open={uploadOpen}
        target={PhotoTypes.AVATAR}
      />
      <ListOverview name={t('lists:ownRecipes')} queryObject={ownRecipesQuery} />
    </FlexColContainer>
  );
};

export default UserSite;
