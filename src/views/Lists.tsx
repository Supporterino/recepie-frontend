import { useQuery } from '@tanstack/react-query';
import FlexColContainer from '../components/layout/FlexColContainer';
import ListView from '../components/listViews/ListView';
import { getCookList, getOwnFavorites } from '../services/requests';

const Lists: React.FunctionComponent = () => {
    const { isLoading: ownFavoritesIsLoading, isError: ownFavoritesIsError, error: ownFavoritesError, data: favorites } = useQuery(['ownFavorites'], getOwnFavorites);
    const { isLoading: cooklistIsLoading, isError: cooklistIsError, error: cooklistError, data: cooklist } = useQuery(['cooklist'], getCookList);

    console.log(favorites)
    console.log(cooklist)
  return <FlexColContainer>
    <ListView name='Favorites' recipes={favorites} isLoading={ownFavoritesIsLoading} isError={ownFavoritesIsError} error={`${ownFavoritesError}`} />
    <ListView name='Cooklist' recipes={cooklist} isLoading={cooklistIsLoading} isError={cooklistIsError} error={`${cooklistError}`} />
  </FlexColContainer>;
};

export default Lists;
