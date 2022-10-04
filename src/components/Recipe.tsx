import { Box, Button, Divider, Rating, Typography } from '@mui/material';
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
import {
  alignCenterJustifyStart,
  centerStyle,
  centerTopStyleRow,
  gridOutline
} from './layout/commonSx';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

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
      <Flex sx={alignCenterJustifyStart}>
        <Button
          size="small"
          onClick={() => {
            navigate(-1);
          }}
          startIcon={<ArrowBackIosNewIcon />}
        >
          Back
        </Button>
      </Flex>

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
        <FlexCol sx={{ justifyContent: 'space-evenly' }}>
          <Typography variant="h5">{recipe.name}</Typography>
          <Typography variant="body2">by {recipe.owner.username}</Typography>
          <Flex sx={alignCenterJustifyStart}>
            <Rating value={recipe.rating.avgRating} readOnly precision={0.5} />
            <Typography sx={{ color: 'text.secondary' }} variant="body2" ml={0.5}>
              ({recipe.rating.numOfRatings})
            </Typography>
          </Flex>
        </FlexCol>
      </Flex>

      <Typography variant="h6">Description</Typography>
      <Typography variant="body2" mb={1}>
        {recipe.description}
      </Typography>
      <Divider light />

      <Typography variant="h6">Ingredients</Typography>
      <Grid container my={1} sx={gridOutline}>
        <Grid xs={6} sx={centerStyle}>
          <Typography sx={{ fontWeight: 'bold' }}>Ingredient</Typography>
        </Grid>
        <Grid xs={6} sx={centerStyle}>
          <Typography sx={{ fontWeight: 'bold' }}>Amount</Typography>
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
      <Divider light />

      <Typography variant="h6">Steps</Typography>
      <Grid container my={1} sx={gridOutline}>
        {recipe.steps.map((step: string, index: number) => (
          <>
            <Grid xs={2} key={`${index}-key`} sx={centerStyle}>
              <Typography>{index}.</Typography>
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
