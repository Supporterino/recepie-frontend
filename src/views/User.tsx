import { Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import FlexColContainer from '../components/layout/FlexColContainer';
import ErrorDisplay from '../components/queryUtils/ErrorText';
import Loader from '../components/queryUtils/Loader';
import { authenticationManager } from '../services/AuthenticationManager';
import { getOwnRecipes, getUser } from '../services/requests';
import FlexCol from '../components/layout/FlexCol';
import {
  alignCenterJustifyCenter,
  alignStartJustifyCenter,
} from '../components/layout/commonSx';
import { getRoleKeyName, Recipe, User } from '../types';
import ListOverview from '../components/listViews/ListOverview';
import UserImage from '../components/user/UserImage';
import Flex from '../components/layout/Flex';

const UserSite: React.FunctionComponent = () => {
  const userID = authenticationManager.getUserID();
  const {
    isLoading,
    isError,
    error,
    data: user
  } = useQuery<User>(['users', userID], () => getUser(userID));

  const ownRecipesQuery = useQuery<Recipe[]>(['ownRecipes'], getOwnRecipes);

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
          sx={{ mr: 1 }}
          width="150px"
          height="150px"
          url={`${user.avatar !== '' ? user.avatar : 'images/no-pictures.png'}`}
          round
        />
        <FlexCol sx={alignStartJustifyCenter}>
          <Typography variant="h6">{user.username}</Typography>
          <Typography>{(new Date(user.joinedAt)).toLocaleDateString()}</Typography>
          <Typography>{getRoleKeyName(user.role)}</Typography>
        </FlexCol>
      </Flex>

      <ListOverview name="Own recipes" queryObject={ownRecipesQuery} />
    </FlexColContainer>
  );
};

export default UserSite;
