import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';
import ListIcon from '@mui/icons-material/List';
import { useLocation, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useLoggedIn from '../utils/useLoggedIn';

const NavBar: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const loggedIn = useLoggedIn();
  const minWidthIcon = '50px';
  const paddingIcons = 0.1;

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setActiveTab(0);
        break;
      case '/lists':
        setActiveTab(1);
        break;
      case '/create':
        setActiveTab(2);
        break;
      case '/login':
        setActiveTab(3);
        break;
      case '/me':
        setActiveTab(4);
        break;
      case '/settings':
        setActiveTab(5);
        break;
      default:
        setActiveTab(-1);
        break;
    }
  }, [location]);

  return (
    <BottomNavigation
      showLabels
      value={activeTab}
      onChange={(event, newIndex) => {
        setActiveTab(newIndex);
      }}
    >
      <BottomNavigationAction
        sx={{ px: paddingIcons, minWidth: minWidthIcon }}
        label="Home"
        icon={<HomeIcon />}
        onClick={() => {
          navigate('/');
        }}
      />
      <BottomNavigationAction
        sx={{ px: paddingIcons, minWidth: minWidthIcon }}
        label="Lists"
        icon={<ListIcon />}
        onClick={() => {
          navigate('/lists');
        }}
      />
      <BottomNavigationAction
        sx={{ px: paddingIcons, minWidth: minWidthIcon }}
        label="New"
        disabled={!loggedIn}
        icon={<AddOutlinedIcon />}
        onClick={() => {
          navigate('/create');
        }}
      />
      {!loggedIn && (
        <BottomNavigationAction
          sx={{ px: paddingIcons, minWidth: minWidthIcon }}
          label="Login"
          icon={<LoginIcon />}
          onClick={() => {
            navigate('/login');
          }}
        />
      )}
      {loggedIn && (
        <BottomNavigationAction
          sx={{ px: paddingIcons, minWidth: minWidthIcon }}
          label="Account"
          icon={<AccountCircleIcon />}
          onClick={() => {
            navigate('/me');
          }}
        />
      )}
      <BottomNavigationAction
        sx={{ px: paddingIcons, minWidth: minWidthIcon }}
        label="Settings"
        icon={<SettingsIcon />}
        onClick={() => {
          navigate('/settings');
        }}
      />
    </BottomNavigation>
  );
};

export default NavBar;
