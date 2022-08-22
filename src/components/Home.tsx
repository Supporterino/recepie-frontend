import { Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAllReceipes } from '../services/requests';
import { Recipe } from '../types';
import ErrorDisplay from './queryUtils/ErrorText';
import Loader from './queryUtils/Loader';

const Home: React.FunctionComponent = () => {
  const { isLoading, isError, error, data } = useQuery(['receipes'], getAllReceipes);

  if (isLoading) return <Loader></Loader>;

  if (isError) return <ErrorDisplay text={`${error}`}></ErrorDisplay>;

  return (
    <Container>
      {data.map((receipe: Recipe, index: number) => {
        return <Typography key={index}>{receipe.name}</Typography>;
      })}
    </Container>
  );
};

export default Home;
