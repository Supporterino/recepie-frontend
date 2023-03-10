/* eslint-disable object-curly-newline */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-extra-parens */
/* eslint-disable import/no-extraneous-dependencies */
import useLoggedIn from '../../hooks/useLoggedIn';
import sendRequest, {
  addCookListUrl,
  addFavoriteUrl,
  removeCookListUrl,
  removeFavoriteUrl,
} from '../../services/sendRequest';
import {
  type Recipe,
} from '../../types';
import {
  alignCenterJustifyCenter,
  centerStyle,
  flexCol,
} from '../layout/commonSx';
import RecipeImage from '../recipe/RecipeImage';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PendingIcon from '@mui/icons-material/Pending';
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Rating,
  Typography,
} from '@mui/material';
import Grid from '@mui/system/Unstable_Grid';
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  useSnackbar,
} from 'notistack';
import {
  useTranslation,
} from 'react-i18next';
import {
  useNavigate,
} from 'react-router-dom';

export type CardWideProps = {
  recipe: Recipe,
};

const CardWide: React.FunctionComponent<CardWideProps> = ({
  recipe,
}: CardWideProps) => {
  const queryClient = useQueryClient();
  const {
    enqueueSnackbar,
  } = useSnackbar();
  const navigate = useNavigate();
  const loggedIn = useLoggedIn();
  const {
    t,
  } = useTranslation('common');

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const lineLimit = (number_: number) => {
    return {
      display: '-webkit-box',
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: number_,
    } as const;
  };

  const favMutation = useMutation(
    () => (recipe.isFavorite ? sendRequest(removeFavoriteUrl, 'DELETE', { recipeID: recipe.id }) : sendRequest(addFavoriteUrl, 'POST', { recipeID: recipe.id })),
    {
      onError: () => {
        enqueueSnackbar(t('snackbar.errorFav'), {
          variant: 'warning',
        });
      },
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries([
            'recipes',
          ]),
          queryClient.invalidateQueries([
            'ownFavorites',
          ]),
          queryClient.invalidateQueries([
            'lists',
          ]),
          queryClient.invalidateQueries([
            'ownRecipes',
          ]),
        ]);
      },
    },
  );

  const cooklistMutation = useMutation(
    () => (recipe.isCookList ? sendRequest(removeCookListUrl, 'DELETE', { recipeID: recipe.id }) : sendRequest(addCookListUrl, 'POST', { recipeID: recipe.id })),
    {
      onError: () => {
        enqueueSnackbar(t('snackbar.errorCooklist'), {
          variant: 'warning',
        });
      },
      onSuccess: () => {
        return Promise.all([
          queryClient.invalidateQueries([
            'recipes',
          ]),
          queryClient.invalidateQueries([
            'cooklist',
          ]),
          queryClient.invalidateQueries([
            'lists',
          ]),
        ]);
      },
    },
  );

  return (
    <Card
      raised sx={{
        borderRadius: '4px',
        boxShadow: 10,
        display: 'flex',
        my: 1,
      }}
    >
      <CardContent sx={{
        flexBasis: '75%',
        p: 1,
      }}
      >
        <Box sx={{
          width: '100%',
          ...flexCol,
        }}
        >
          <Grid
            container onClick={() => {
              return navigate(`/recipe/${recipe.id}`);
            }} sx={{
              width: '100%',
            }}
          >
            <Grid xs={12}>
              <Typography sx={lineLimit(1)}>{recipe.name}</Typography>
            </Grid>
          </Grid>
          <Grid
            container onClick={() => {
              return navigate(`/recipe/${recipe.id}`);
            }} sx={{
              flexGrow: 1,
              width: '100%',
            }}
          >
            <Grid xs={12}>
              <Typography color='text.secondary' sx={lineLimit(4)} variant='body2'>
                {recipe.description}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container sx={{
              width: '100%',
              ...alignCenterJustifyCenter,
            }}
          >
            <Grid sx={centerStyle} xs={6}>
              <Rating precision={0.5} readOnly size='small' value={recipe.rating.avgRating} />
              <Typography
                ml={0.5} sx={{
                  color: 'text.secondary',
                }} variant='body2'
              >
                ({recipe.rating.numOfRatings})
              </Typography>
            </Grid>
            <Grid sx={centerStyle} xs={3}>
              <IconButton
                disabled={!loggedIn}
                onClick={() => {
                  favMutation.mutate();
                }}
              >
                {recipe.isFavorite && !favMutation.isLoading && <FavoriteIcon color='error' />}
                {!recipe.isFavorite && !favMutation.isLoading && <FavoriteBorderIcon color='secondary' />}
                {favMutation.isLoading && <PendingIcon color='secondary' />}
              </IconButton>
            </Grid>
            <Grid sx={centerStyle} xs={3}>
              <IconButton
                disabled={!loggedIn}
                onClick={() => {
                  cooklistMutation.mutate();
                }}
              >
                {recipe.isCookList && !cooklistMutation.isLoading && <BookmarkIcon color='primary' />}
                {!recipe.isCookList && !cooklistMutation.isLoading && <BookmarkBorderIcon color='secondary' />}
                {cooklistMutation.isLoading && <PendingIcon color='secondary' />}
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <RecipeImage
        height='150px' onClick={() => {
          return navigate(`/recipe/${recipe.id}`);
        }} url={recipe.picture}
        width='120px'
      />
    </Card>
  );
};

export default CardWide;
