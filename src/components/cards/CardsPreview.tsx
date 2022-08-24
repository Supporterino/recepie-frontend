import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Recipe } from '../../types';

export type CardPreviewProps = {
  recipe: Recipe;
};

const CardPreview: React.FunctionComponent<CardPreviewProps> = ({ recipe }: CardPreviewProps) => {
  return (
    <Card sx={{ margin: 'auto', padding: 0 }}>
      <CardMedia
        component="img"
        image={recipe.picture !== '' ? recipe.picture : 'images/no-pictures.png'}
        alt="Image for the recipe"
        sx={{
            height: 100,
            width: '100%',
            objectFit: 'cover'
        }}
      />
      <CardContent sx={{ padding: 0 }}>
        <Typography align="center" variant="h6">
          {recipe.name}
        </Typography>
        <Typography
          align="center"
          sx={{
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 2
          }}
          variant="body2"
        >
          {recipe.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardPreview;
