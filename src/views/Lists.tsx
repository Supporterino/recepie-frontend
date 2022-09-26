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

// TODO: Add path paramter to navigate to detailed list view

export default Lists;
