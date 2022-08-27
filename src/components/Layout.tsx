import { Box, Paper, useMediaQuery } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../views/NavBar';
import SignIn from '../views/SignIn';
import SignUp from '../views/SignUp';
import Home from '../views/Home';
import Settings from '../views/Settings';
import Create from '../views/Create';
import { isIOS } from 'react-device-detect';

const Layout: React.FunctionComponent = () => {
  const isStandalone = useMediaQuery('(display-mode: standalone)');

  return (
    <Box sx={{ height: '100vh', display: 'flex' }} flexDirection={'column'}>
      <Paper sx={{ flexGrow: 1 }} elevation={3}>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create" element={<Create />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Paper>
      <Paper
        sx={{
          paddingBottom: isIOS && isStandalone ? 3 : 0
        }}
        elevation={3}
      >
        <NavBar></NavBar>
      </Paper>
    </Box>
  );
};

export default Layout;
