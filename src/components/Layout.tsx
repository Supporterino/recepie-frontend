import { Box, Paper, useMediaQuery } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../views/NavBar';
import SignIn from '../views/SignIn';
import SignUp from '../views/SignUp';
import Home from '../views/Home';
import Settings from '../views/Settings';
import Create from '../views/Create';
import { isIOS } from 'react-device-detect';
import { centerTopStyleRow } from './layout/commonSx';
import UserSite from '../views/User';
import Lists from '../views/Lists';
import ListView from './listViews/ListView';
import EditRecipeView from './recipe/editRecipe';
import RecipeView from './recipe/Recipe';

const Layout: React.FunctionComponent = () => {
  const isStandalone = useMediaQuery('(display-mode: standalone)');

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', height: window.innerHeight }} flexDirection={'column-reverse'}>
        <Paper
          sx={{
            paddingBottom: isIOS && isStandalone ? 3 : 0,
            flex: 1
          }}
          elevation={0}
        >
          <NavBar></NavBar>
        </Paper>
        <Paper sx={{ height: '100%', overflowY: 'auto', ...centerTopStyleRow }} elevation={1}>
          <Routes>
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/create" element={<Create />} />
            <Route path="/me" element={<UserSite />} />
            <Route path="/lists" element={<Lists />} />
            <Route path="/lists/:name" element={<ListView />} />
            <Route path="/recipe/:id" element={<RecipeView />} />
            <Route path="/edit/:id" element={<EditRecipeView />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </Paper>
      </Box>
    </Box>
  );
};

export default Layout;
