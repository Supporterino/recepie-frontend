import { useQuery } from '@tanstack/react-query';
import { getAllRecipes } from '../services/requests';
import ErrorDisplay from '../components/queryUtils/ErrorText';
import Loader from '../components/queryUtils/Loader';
import FlexColContainer from '../components/layout/FlexColContainer';
import RecipeList from '../components/listViews/RecipeList';
import { Recipe } from '../types';

const Home: React.FunctionComponent = () => {
  const { isLoading, isError, error, data: recipes } = useQuery<Recipe[]>(['recipes'], getAllRecipes);

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

  return <RecipeList recipes={recipes} />;
};

export default Home;
