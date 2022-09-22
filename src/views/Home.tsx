import { useQuery } from '@tanstack/react-query';
import { getAllReceipes } from '../services/requests';
import ErrorDisplay from '../components/queryUtils/ErrorText';
import Loader from '../components/queryUtils/Loader';
import CardWide from '../components/cards/CardWide';
import Grid from '@mui/system/Unstable_Grid';
import { Recipe } from '../types';
import FlexColContainer from '../components/layout/FlexColContainer';

const Home: React.FunctionComponent = () => {
  const { isLoading, isError, error, data } = useQuery(['recipes'], getAllReceipes);

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

  return (
    <Grid maxWidth="lg" container sx={{ width: '100%' }}>
      {data.map((recipe: Recipe, index: number) => (
        <Grid xs={12} sm={12} md={6} lg={4} key={index}>
          <CardWide recipe={recipe} key={`${index}-item`} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
