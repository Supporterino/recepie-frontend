import {
  type Recipe,
} from '../../types';
import {
  alignCenterJustifyCenter,
} from '../layout/commonSx';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import ErrorDisplay from '../queryUtils/ErrorDisplay';
import Loader from '../queryUtils/Loader';
import RecipeImage from '../recipe/RecipeImage';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  useNavigate,
} from 'react-router-dom';

type ListViewProps = {
  name: string,
  queryObject: UseQueryResult<Recipe[]>,
};

const ListOverview: React.FunctionComponent<ListViewProps> = ({
  name,
  queryObject,
}: ListViewProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isXS = useMediaQuery(theme.breakpoints.up('xs'));
  const isSM = useMediaQuery(theme.breakpoints.up('sm'));
  const isMD = useMediaQuery(theme.breakpoints.up('md'));
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));
  let numberOfRecipes = 5;
  const {
    isLoading,
    isError,
    error,
    data: recipes,
  } = queryObject;

  if (isXS) {
    numberOfRecipes = 3;
  }

  if (isSM) {
    numberOfRecipes = 4;
  }

  if (isMD) {
    numberOfRecipes = 5;
  }

  if (isLG) {
    numberOfRecipes = 6;
  }

  if (isXL) {
    numberOfRecipes = 7;
  }

  return (
    <FlexCol sx={{
      boxShadow: 10,
      mt: 2,
    }}
    >
      <Flex sx={alignCenterJustifyCenter}>
        <Typography
          sx={{
            ml: 1,
          }} variant='h5'
        >
          {name}
        </Typography>
        <Box sx={{
          flexGrow: 1,
        }}
        />
        <Typography
          sx={{
            color: 'text.secondary',
            m: 1,
          }} variant='body2'
        >
          {recipes && `( ${recipes.length} )`}
        </Typography>
      </Flex>
      <Divider light variant='middle' />
      <Flex>
        <Flex sx={{
          flexGrow: 1,
          flexWrap: 'no-wrap',
          overflowX: 'hidden',
        }}
        >
          {isLoading && <Loader />}
          {isError && <ErrorDisplay text={`${error}`} />}
          {recipes?.slice(0, numberOfRecipes).map((recipe) => {
            return <RecipeImage
              height='100px'
              key={recipe.id}
              onClick={() => {
                navigate(`/recipe/${recipe.id}`);
              }}
              rounded
              sx={{
                boxShadow: 10,
                m: 1,
              }}
              url={recipe.picture}
              width='100px'
            />;
          })}
        </Flex>
        <Flex>
          <IconButton
            onClick={() => {
              navigate(`/lists/${name}`, {
                state: recipes,
              });
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Flex>
      </Flex>
    </FlexCol>
  );
};

export default ListOverview;
