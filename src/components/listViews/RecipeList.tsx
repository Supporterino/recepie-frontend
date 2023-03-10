/* eslint-disable import/no-extraneous-dependencies */
import {
  type Recipe,
} from '../../types';
import CardWide from '../cards/CardWide';
import Grid from '@mui/system/Unstable_Grid';

type RecipeListProps = {
  recipes: Recipe[],
};

const RecipeList: React.FunctionComponent<RecipeListProps> = ({
  recipes,
}: RecipeListProps) => {
  return (
    <Grid
      columnSpacing={{
        md: 1,
        sm: 1,
        xs: 0,
      }} container maxWidth='lg'
      sx={{
        width: '100%',
      }}
    >
      {recipes.map((recipe: Recipe) => {
        return <Grid key={recipe.id} lg={4} md={6} sm={12} xs={12}>
          <CardWide key={`${recipe.id}-item`} recipe={recipe} />
        </Grid>;
      })}
    </Grid>
  );
};

export default RecipeList;
