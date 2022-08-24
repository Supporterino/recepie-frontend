import { Box, Paper } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import NavBar from './NavBar';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import Home from './Home';

const Layout: React.FunctionComponent = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <Paper sx={{ height: '98%', marginTop: '2%' }} elevation={3}>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Paper>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <NavBar></NavBar>
      </Paper>
    </Box>
  );
};

export default Layout;
