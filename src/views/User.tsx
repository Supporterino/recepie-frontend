import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import FlexColContainer from '../components/layout/FlexColContainer';
import ErrorDisplay from '../components/queryUtils/ErrorText';
import Loader from '../components/queryUtils/Loader';
import { authenticationManager } from '../services/AuthenticationManager';
import { getOwnRecipes, getUser } from '../services/requests';
import FlexCol from '../components/layout/FlexCol';
import { alignCenterJustifyCenter, alignStartJustifyCenter } from '../components/layout/commonSx';
import { getRoleKeyName, Recipe, Role, User } from '../types';
import ListOverview from '../components/listViews/ListOverview';
import UserImage from '../components/user/UserImage';
import Flex from '../components/layout/Flex';
import { ReactNode, useState } from 'react';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppBadIcon from '@mui/icons-material/GppBad';
import ImageUpload, { Target } from '../components/createSteps/imageUpload';

const UserSite: React.FunctionComponent = () => {
  const userID = authenticationManager.getUserID();
  const {
    isLoading,
    isError,
    error,
    data: user
  } = useQuery<User>(['users', userID], () => getUser(userID));

  const ownRecipesQuery = useQuery<Recipe[]>(['ownRecipes'], getOwnRecipes);
  const [uploadOpen, setUploadOpen] = useState<boolean>(false);

  const getRoleNode = (role: Role): ReactNode => {
    const roleString = getRoleKeyName(role).replaceAll(
      /\S*/g,
      (word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`
    );
    return (
      <Flex sx={{ mb: 0.25, ...alignCenterJustifyCenter }}>
        <AdminPanelSettingsIcon fontSize="small" color={role > 1 ? 'error' : 'secondary'} />
        <Typography color={role > 1 ? 'error' : 'secondary'} sx={{ ml: 0.5 }}>
          {roleString}
        </Typography>
      </Flex>
    );
  };

  const getVerifyNode = (verified: boolean): ReactNode => {
    return (
      <Flex sx={alignCenterJustifyCenter}>
        {verified ? <VerifiedUserIcon fontSize="small" /> : <GppBadIcon fontSize="small" />}
        {verified ? (
          <Typography sx={{ ml: 0.5 }}>Verified</Typography>
        ) : (
          <Typography sx={{ ml: 0.5 }}>Unverified</Typography>
        )}
      </Flex>
    );
  };

  if (isLoading)
    return (
      <FlexColContainer>
        <Loader />
      </FlexColContainer>
    );

  if (isError)
    return (
      <FlexColContainer>
        <ErrorDisplay text={`${error}`} />
      </FlexColContainer>
    );

  return (
    // TODO: Build site
    <FlexColContainer>
      <Flex sx={alignCenterJustifyCenter}>
        <UserImage
          sx={{ mr: 5 }}
          width="150px"
          height="150px"
          url={`${user.avatar !== '' ? user.avatar : 'images/no-pictures.png'}`}
          round
          onClick={() => setUploadOpen(true)}
        />
        <FlexCol sx={alignStartJustifyCenter}>
          <Typography sx={{ mb: 0.5 }} variant="h5">
            {user.username}
          </Typography>
          <Flex sx={{ mb: 0.25, ...alignCenterJustifyCenter }}>
            <CalendarMonthIcon fontSize="small" />
            <Typography sx={{ ml: 0.5 }}>{new Date(user.joinedAt).toLocaleDateString()}</Typography>
          </Flex>
          {getRoleNode(user.role)}
          {getVerifyNode(user.verified)}
        </FlexCol>
      </Flex>
      <ImageUpload
        open={uploadOpen}
        close={() => {
          setUploadOpen(false);
        }}
        target={Target.USER}
      />
      <ListOverview name="Own recipes" queryObject={ownRecipesQuery} />
    </FlexColContainer>
  );
};

export default UserSite;
