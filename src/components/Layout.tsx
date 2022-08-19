import { Box, Paper } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import RecipeList from './RecipeList';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';

const Layout: React.FunctionComponent = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <Paper sx={{ height: '100%' }}>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/" element={<RecipeList />} />
        </Routes>
      </Paper>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <NavBar></NavBar>
      </Paper>
    </Box>
  );
};

export default Layout;
