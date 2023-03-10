/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  getListsRequest,
} from '../../services/requests';
import {
  alignCenterJustifyCenter,
} from '../layout/commonSx';
import Flex from '../layout/Flex';
import FlexColContainer from '../layout/FlexColContainer';
import ErrorDisplay from '../queryUtils/ErrorDisplay';
import Loader from '../queryUtils/Loader';
import RecipeList from './RecipeList';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import {
  IconButton,
  Typography,
} from '@mui/material';
import {
  useQuery,
} from '@tanstack/react-query';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

const ListView: React.FunctionComponent = () => {
  const {
    name,
  } = useParams();
  const navigate = useNavigate();

  if (!name) {
    navigate('/lists');
  }

  const {
    isLoading,
    isError,
    error,
    data: recipes,
  } = useQuery([
    'lists',
    name,
  ], () => {
    return getListsRequest(name!);
  });

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
    <FlexColContainer
      header={
        <Flex
          sx={{
            backgroundColor: 'background.paper',
            p: 1,
            width: '100%',
            ...alignCenterJustifyCenter,
          }}
        >
          <IconButton
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <Typography
            sx={{
              flexGrow: 1,
              textAlign: 'center',
            }} variant='h6'
          >
            {name}
          </Typography>
        </Flex>
      }
    >
      <RecipeList recipes={recipes} />
    </FlexColContainer>
  );
};

export default ListView;
