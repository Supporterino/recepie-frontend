import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import FlexColContainer from '../components/layout/FlexColContainer';
import ListOverview from '../components/listViews/ListOverview';
import { getCookList, getOwnFavorites } from '../services/requests';

const Lists: React.FunctionComponent = () => {
  const favoritesQuery = useQuery(['ownFavorites'], getOwnFavorites);
  const cooklistQuery = useQuery(['cooklist'], getCookList);
  const { t } = useTranslation('lists');

  return (
    <FlexColContainer>
      <ListOverview name={t('favorites')} queryObject={favoritesQuery} />
      <ListOverview name={t('cooklist')} queryObject={cooklistQuery} />
    </FlexColContainer>
  );
};

export default Lists;
