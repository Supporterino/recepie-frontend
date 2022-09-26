import { Box, Rating, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipe } from '../services/requests';
import { Ingredient, Recipe } from '../types';
import Flex from './layout/Flex';
import FlexCol from './layout/FlexCol';
import FlexColContainer from './layout/FlexColContainer';
import ErrorDisplay from './queryUtils/ErrorText';
import Loader from './queryUtils/Loader';
import Grid from '@mui/system/Unstable_Grid';
import { centerStyle } from './layout/commonSx';

const RecipeView: React.FunctionComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) navigate('/');
  const {
    isLoading,
    isError,
    error,
    data: recipe
  } = useQuery<Recipe>(['recipe', id], () => getRecipe(id!));

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
      <Flex>
        <Box
          sx={{
            width: '100px',
            height: '100px',
            backgroundImage: `url(${
              recipe.picture !== '' ? recipe.picture : 'images/no-pictures.png'
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            m: 1,
            borderRadius: 2,
            border: 0,
            boxShadow: 3
          }}
        />
        <FlexCol>
          <Typography>{recipe.name}</Typography>
          <Typography>by {recipe.owner.username}</Typography>
          <Flex>
            <Rating value={recipe.rating.avgRating} readOnly precision={0.5} size="small" />
            <Typography sx={{ color: 'text.secondary' }} variant="body2" ml={0.5}>
              ({recipe.rating.numOfRatings})
            </Typography>
          </Flex>
        </FlexCol>
      </Flex>

      <Typography>{recipe.description}</Typography>

      <Grid container mt={1}>
        <Grid xs={6} sx={centerStyle}>
          <Typography>Ingredient</Typography>
        </Grid>
        <Grid xs={6} sx={centerStyle}>
          <Typography>Amount</Typography>
        </Grid>
        {recipe.ingredients.items.map((ing: Ingredient, index: number) => (
          <>
            <Grid xs={6} key={`${index}-name`} sx={centerStyle}>
              <Typography>{ing.name}</Typography>
            </Grid>
            <Grid xs={6} key={`${index}-amount`} sx={centerStyle}>
              <Typography>
                {ing.amount} {ing.unit}
              </Typography>
            </Grid>
          </>
        ))}
      </Grid>

      <Typography variant="h6">Steps</Typography>
      <Grid container mt={1}>
        {recipe.steps.map((step: string, index: number) => (
          <>
            <Grid xs={2} key={`${index}-key`} sx={centerStyle}>
              <Typography>{index}</Typography>
            </Grid>
            <Grid xs={10} key={`${index}-name`} sx={centerStyle}>
              <Typography>{step}</Typography>
            </Grid>
          </>
        ))}
      </Grid>
    </FlexColContainer>
  );
};

export default RecipeView;
