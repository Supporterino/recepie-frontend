import { IconButton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookList, getOwnFavorites } from '../../services/requests';
import Flex from '../layout/Flex';
import FlexColContainer from '../layout/FlexColContainer';
import ErrorDisplay from '../queryUtils/ErrorText';
import Loader from '../queryUtils/Loader';
import RecipeList from './RecipeList';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { centerStyle } from '../layout/commonSx';
const ListView: React.FunctionComponent = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  if (!name) navigate('/lists');
  const {
    isLoading,
    isError,
    error,
    data: recipes
  } = useQuery(['lists', name], name === 'Favorites' ? getOwnFavorites : getCookList);

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
    <FlexColContainer>
      <Flex sx={{ backgroundColor: 'background.paper', p: 1, ...centerStyle }}>
        <IconButton
          onClick={() => {
            navigate('/lists');
          }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {name}
        </Typography>
      </Flex>
      <RecipeList recipes={recipes} />
    </FlexColContainer>
  );
};

export default ListView;
