import { Box, Paper } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../views/NavBar';
import SignIn from '../views/SignIn';
import SignUp from '../views/SignUp';
import Home from '../views/Home';
import Settings from '../views/Settings';

const Layout: React.FunctionComponent = () => {
  return (
    <Box sx={{ height: '100vh' }}>
      <Paper sx={{ height: '98%', marginTop: '2%' }} elevation={3}>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path='/settings' element={<Settings />} />
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
