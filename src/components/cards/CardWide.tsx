import { Box, Card, CardContent, IconButton, Rating, Typography } from '@mui/material';
import { Recipe } from '../../types';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PendingIcon from '@mui/icons-material/Pending';
import Grid from '@mui/system/Unstable_Grid';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import sendRequest, {
  addCookListUrl,
  addFavoriteUrl,
  removeCookListUrl,
  removeFavoriteUrl
} from '../../services/requestService';
import { useSnackbar } from 'notistack';
import { alignCenterJustifyCenter, centerStyle, flexCol } from '../layout/commonSx';

export type CardWideProps = {
  recipe: Recipe;
};

const CardWide: React.FunctionComponent<CardWideProps> = ({ recipe }: CardWideProps) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const imgURL = () => {
    return `url(${recipe.picture !== '' ? recipe.picture : 'images/no-pictures.png'})`;
  };

  const lineLimit = (num: number) => {
    return {
      display: '-webkit-box',
      overflow: 'hidden',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: num
    } as const;
  };

  const favMutation = useMutation(
    () =>
      recipe.isFavorite
        ? sendRequest(removeFavoriteUrl, 'DELETE', { recipeID: recipe.id })
        : sendRequest(addFavoriteUrl, 'POST', { recipeID: recipe.id }),
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(['recipes']);
      },
      onError: (error, variables, context) => {
        enqueueSnackbar('Failed to set favorite on recipe', { variant: 'warning' });
      }
    }
  );

  const cooklistMutation = useMutation(
    () =>
      recipe.isCookList
        ? sendRequest(removeCookListUrl, 'DELETE', { recipeID: recipe.id })
        : sendRequest(addCookListUrl, 'POST', { recipeID: recipe.id }),
    {
      onSuccess: () => {
        return queryClient.invalidateQueries(['recipes']);
      },
      onError: (error, variables, context) => {
        enqueueSnackbar('Failed to set cooklist on recipe', { variant: 'warning' });
      }
    }
  );

  return (
    <Card sx={{ display: 'flex', m: 1 }}>
      <CardContent sx={{ p: 1, flexBasis: '75%' }}>
        <Box sx={{ width: '100%', ...flexCol }}>
          <Grid container sx={{ width: '100%' }}>
            <Grid xs={12}>
              <Typography sx={lineLimit(1)}>{recipe.name}</Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ width: '100%', flexGrow: 1 }}>
            <Grid xs={12}>
              <Typography sx={lineLimit(4)} variant="body2" color="text.secondary">
                {recipe.description}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ width: '100%', ...alignCenterJustifyCenter }}>
            <Grid xs={6} sx={centerStyle}>
              <Rating value={recipe.rating.avgRating} readOnly precision={0.5} size="small" />
              <Typography sx={{ color: 'text.secondary' }} variant="body2" ml={0.5}>
                ({recipe.rating.numOfRatings})
              </Typography>
            </Grid>
            <Grid xs={3} sx={centerStyle}>
              <IconButton
                onClick={() => {
                  favMutation.mutate();
                }}
              >
                {recipe.isFavorite && !favMutation.isLoading && <FavoriteIcon color="error" />}
                {!recipe.isFavorite && !favMutation.isLoading && (
                  <FavoriteBorderIcon color="secondary" />
                )}
                {favMutation.isLoading && <PendingIcon color="secondary" />}
              </IconButton>
            </Grid>
            <Grid xs={3} sx={centerStyle}>
              <IconButton
                onClick={() => {
                  cooklistMutation.mutate();
                }}
              >
                {recipe.isCookList && !cooklistMutation.isLoading && (
                  <BookmarkIcon color="primary" />
                )}
                {!recipe.isCookList && !cooklistMutation.isLoading && (
                  <BookmarkBorderIcon color="secondary" />
                )}
                {cooklistMutation.isLoading && <PendingIcon color="secondary" />}
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
      <Box
        sx={{
          width: '150px',
          height: '150px',
          backgroundImage: imgURL(),
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          m: 1,
          borderRadius: 1,
          border: 0
        }}
      />
    </Card>
  );
};

export default CardWide;
