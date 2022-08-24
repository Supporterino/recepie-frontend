import { Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAllReceipes } from '../services/requests';
import { Recipe } from '../types';
import CardPreview from './cards/CardsPreview';
import ErrorDisplay from './queryUtils/ErrorText';
import Loader from './queryUtils/Loader';

const Home: React.FunctionComponent = () => {
  const { isLoading, isError, error, data } = useQuery(['receipes'], getAllReceipes);

  if (isLoading) return <Loader></Loader>;

  if (isError) return <ErrorDisplay text={`${error}`}></ErrorDisplay>;

  return (
    <Grid
      container
      justifyContent="space-evenly"
      alignItems="center"
      spacing={{ xs: 2, md: 3 }}
      columns={{ xs: 12, sm: 12, md: 12 }}
    >
      {data.map((recipe: Recipe, index: number) => (
        <Grid item xs={5} sm={2} md={2} key={index}>
          <CardPreview recipe={recipe}></CardPreview>
        </Grid>
      ))}
    </Grid>
  );
};

export default Home;
