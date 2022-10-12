import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import FlexColContainer from '../components/layout/FlexColContainer';
import ErrorDisplay from '../components/queryUtils/ErrorText';
import Loader from '../components/queryUtils/Loader';
import { authenticationManager } from '../services/AuthenticationManager';
import { getOwnRecipes, getUser } from '../services/requests';
import FlexCol from '../components/layout/FlexCol';
import { centerTopStyleCol } from '../components/layout/commonSx';
import { Recipe } from '../types';
import ListOverview from '../components/listViews/ListOverview';

const User: React.FunctionComponent = () => {
  const userID = authenticationManager.getUserID();
  const {
    isLoading,
    isError,
    error,
    data: user
  } = useQuery(['users', userID], () => getUser(userID));

  const ownRecipesQuery = useQuery<Recipe[]>(['ownRecipes'], getOwnRecipes);

  const imgURL = () => {
    return `url(${user.avatar})`;
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
      <FlexCol sx={centerTopStyleCol}>
        <Box
          sx={{
            width: '150px',
            height: '150px',
            backgroundImage: imgURL(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            m: 1,
            borderRadius: 50,
            border: 0
          }}
        />
        <Typography variant="h6">{user.username}</Typography>
      </FlexCol>
      <ListOverview name="Own recipes" queryObject={ownRecipesQuery} />
    </FlexColContainer>
  );
};

export default User;
