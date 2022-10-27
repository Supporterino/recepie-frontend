import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Recipe } from '../../types';
import Flex from '../layout/Flex';
import FlexCol from '../layout/FlexCol';
import ErrorDisplay from '../queryUtils/ErrorText';
import Loader from '../queryUtils/Loader';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useNavigate } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import RecipeImage from '../recipe/RecipeImage';
import { alignCenterJustifyCenter } from '../layout/commonSx';

type ListViewProps = {
  name: string;
  queryObject: UseQueryResult<Recipe[]>;
};

const ListOverview: React.FunctionComponent<ListViewProps> = ({
  name,
  queryObject
}: ListViewProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isXS = useMediaQuery(theme.breakpoints.up('xs'));
  const isSM = useMediaQuery(theme.breakpoints.up('sm'));
  const isMD = useMediaQuery(theme.breakpoints.up('md'));
  const isLG = useMediaQuery(theme.breakpoints.up('lg'));
  const isXL = useMediaQuery(theme.breakpoints.up('xl'));
  let numOfRecipes = 5;
  const { isLoading, isError, error, data: recipes } = queryObject;

  if (isXS) numOfRecipes = 3;
  if (isSM) numOfRecipes = 4;
  if (isMD) numOfRecipes = 5;
  if (isLG) numOfRecipes = 6;
  if (isXL) numOfRecipes = 7;

  return (
    // TODO: Better design
    <FlexCol sx={{ mt: 2, boxShadow: 10 }}>
      <Flex sx={alignCenterJustifyCenter}>
        <Typography sx={{ ml: 1 }} variant="h5">
          {name}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography variant="body2" sx={{ m: 1, color: 'text.secondary' }}>
          {recipes && `( ${recipes.length} )`}
        </Typography>
      </Flex>
      <Flex>
        <Flex sx={{ flexGrow: 1, overflowX: 'hidden', flexWrap: 'no-wrap' }}>
          {isLoading && <Loader />}
          {isError && <ErrorDisplay text={`${error}`} />}
          {recipes &&
            recipes.slice(0, numOfRecipes).map((recipe, index) => (
              <RecipeImage
                url={`${recipe.picture !== '' ? recipe.picture : 'images/no-pictures.png'}`}
                onClick={() => {
                  navigate(`/recipe/${recipe.id}`);
                }}
                height="100px"
                width="100px"
                rounded
                sx={{ m: 1, boxShadow: 10 }}
              />
            ))}
        </Flex>
        <Flex>
          <IconButton
            onClick={() => {
              navigate(`/lists/${name}`, { state: recipes });
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
