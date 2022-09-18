import { Box, Card, CardContent, IconButton, Rating, Typography } from '@mui/material';
import { Recipe } from '../../types';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Grid from '@mui/system/Unstable_Grid';

export type CardWideProps = {
  recipe: Recipe;
};

const CardWide: React.FunctionComponent<CardWideProps> = ({ recipe }: CardWideProps) => {
  const imgURL = () => {
    return `url(${recipe.picture !== '' ? recipe.picture : 'images/no-pictures.png'})`;
  };

  const alignCenter = { justifyContent: 'center', alignItems: 'center' } as const
  
  const centerStyle = { display: 'flex', ...alignCenter } as const

  const lineLimit = (num: number) => {
    return {
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: num
      } as const
  }

  return (
    <Card sx={{ display: 'flex' }}>
      <CardContent sx={{ p: 1, flexBasis: '75%' }}>
        <Box sx={{ display: ' flex', flexDirection: 'column', width: '100%', height: '100%' }}>
          <Grid container sx={{ width: '100%' }}>
            <Grid xs={12}>
              <Typography sx={lineLimit(1)}>{recipe.name}</Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ width: '100%', flexGrow: 1 }}>
            <Grid xs={12}>
              <Typography
                sx={lineLimit(4)}
                variant="body2"
                color="text.secondary"
              >
                {recipe.description}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ width: '100%', ...alignCenter}}>
            <Grid xs={6} sx={centerStyle}>
            <Rating value={recipe.rating.avgRating} readOnly precision={0.5} size="small" />
            </Grid>
            <Grid xs={3} sx={centerStyle}>
              <IconButton>
                {recipe.isFavorite && <FavoriteIcon color="error" />}
                {!recipe.isFavorite && <FavoriteBorderIcon color="secondary" />}
              </IconButton>
            </Grid>
            <Grid xs={3} sx={centerStyle}>
              <IconButton>
                {recipe.isCookList && <BookmarkIcon color="primary" />}
                {!recipe.isCookList && <BookmarkBorderIcon color="secondary" />}
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
