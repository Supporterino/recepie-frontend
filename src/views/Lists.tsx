import { useQuery } from '@tanstack/react-query';
import FlexColContainer from '../components/layout/FlexColContainer';
import ListOverview from '../components/listViews/ListOverview';
import { getCookList, getOwnFavorites } from '../services/requests';

const Lists: React.FunctionComponent = () => {
  const favoritesQuery = useQuery(['ownFavorites'], getOwnFavorites);
  const cooklistQuery = useQuery(['cooklist'], getCookList);

  return (
    <FlexColContainer>
      <ListOverview name="Favorites" queryObject={favoritesQuery} />
      <ListOverview name="Cooklist" queryObject={cooklistQuery} />
    </FlexColContainer>
  );
};

export default Lists;
