import ErrorDisplay from '../components/queryUtils/ErrorText';
import Loader from '../components/queryUtils/Loader';
import FlexColContainer from '../components/layout/FlexColContainer';
import RecipeList from '../components/listViews/RecipeList';
import { Recipe } from '../types';
import Search from '../components/listViews/search';
import { useState } from 'react';

const Home: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<unknown>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  return (
    <FlexColContainer>
      <Search
        setError={setError}
        setIsError={setIsError}
        setIsLoading={setIsLoading}
        setRecipes={setRecipes}
      />
      {isLoading && <Loader />}
      {isError && <ErrorDisplay text={`${error}`} />}
      <RecipeList recipes={recipes} />
    </FlexColContainer>
  );
};

export default Home;
