import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography
} from '@mui/material';

const Loader: React.FunctionComponent = () => {
  return (
    <Container sx={{ flexGrow: 1 }}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        height={'100%'}
      >
        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            borderRadius: 4,
            p: 2
          }}
        >
          <CircularProgress sx={{ mx: 3, my: 1 }} />
          <Typography sx={{ mx: 1 }}>Loading...</Typography>
        </Box>
      </Grid>
    </Container>
  );
};

export default Loader;
