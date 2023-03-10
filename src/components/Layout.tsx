import Create from '../views/Create';
import Home from '../views/Home';
import Lists from '../views/Lists';
import NavBar from '../views/NavBar';
import PasswordReset from '../views/PasswordReset';
import Settings from '../views/Settings';
import SignIn from '../views/SignIn';
import SignUp from '../views/SignUp';
import UserSite from '../views/UserSite';
import Verification from './auth/Verification';
import {
  centerTopStyleRow,
} from './layout/commonSx';
import ListView from './listViews/ListView';
import EditRecipe from './recipe/EditRecipe';
import RecipeView from './recipe/RecipeView';
import {
  Box,
  Paper,
  useMediaQuery,
} from '@mui/material';
import {
  isIOS,
} from 'react-device-detect';
import {
  Route,
  Routes,
} from 'react-router-dom';

const Layout: React.FunctionComponent = () => {
  const isStandalone = useMediaQuery('(display-mode: standalone)');

  return (
    <Box sx={{
      height: '100%',
      overflow: 'hidden',
    }}
    >
      <Box
        flexDirection='column-reverse' sx={{
          display: 'flex',
          height: window.innerHeight,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            paddingBottom: isIOS && isStandalone ? 3 : 0,
          }}
        >
          <NavBar />
        </Paper>
        <Paper
          elevation={1} sx={{
            height: '100%',
            overflowY: 'auto',
            ...centerTopStyleRow,
          }}
        >
          <Routes>
            <Route element={<SignIn />} path='/login' />
            <Route element={<SignUp />} path='/register' />
            <Route element={<Settings />} path='/settings' />
            <Route element={<Create />} path='/create' />
            <Route element={<UserSite />} path='/me' />
            <Route element={<Lists />} path='/lists' />
            <Route element={<ListView />} path='/lists/:name' />
            <Route element={<RecipeView />} path='/recipe/:id' />
            <Route element={<EditRecipe />} path='/edit/:id' />
            <Route element={<Verification />} path='/completeVerification' />
            <Route element={<PasswordReset />} path='/passwordReset' />
            <Route element={<Home />} path='/' />
          </Routes>
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;
