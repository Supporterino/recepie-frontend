import Grid from '@mui/system/Unstable_Grid';
import { Recipe } from '../../types';
import CardWide from '../cards/CardWide';

type RecipeListProps = {
    recipes: Recipe[];
};

const RecipeList: React.FunctionComponent<RecipeListProps> = ({ recipes }: RecipeListProps) => {
    return (
        <Grid maxWidth="lg" container sx={{ width: '100%' }} columnSpacing={{ xs: 0, sm: 1, md: 1 }}>
            {recipes.map((recipe: Recipe, index: number) => (
                <Grid xs={12} sm={12} md={6} lg={4} key={index}>
                    <CardWide recipe={recipe} key={`${index}-item`} />
                </Grid>
            ))}
        </Grid>
    );
};

export default RecipeList;
