import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';
import ListIcon from '@mui/icons-material/List';
import { useLocation, useNavigate } from 'react-router-dom';
import { authenticationManager } from '../services/AuthenticationManager';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setActiveTab(0);
        break;
      case '/login':
        setActiveTab(3);
        break;
      case '/settings':
        setActiveTab(5);
        break;
      default:
        setActiveTab(-1);
        break;
    }
  }, [location]);

  useEffect(() => {
    if (authenticationManager.hasUser() && !loggedIn) setLoggedIn(true);
    if (!authenticationManager.hasUser() && loggedIn) setLoggedIn(false);
  });

  return (
    <BottomNavigation
      showLabels
      value={activeTab}
      onChange={(event, newIndex) => {
        setActiveTab(newIndex);
      }}
    >
      <BottomNavigationAction
        label="Home"
        icon={<HomeIcon />}
        onClick={() => {
          navigate('/');
        }}
      />
      <BottomNavigationAction label="Lists" icon={<ListIcon />} />
      <BottomNavigationAction
        label="New"
        disabled={!loggedIn}
        icon={<AddOutlinedIcon />}
        onClick={() => {
          navigate('/create');
        }}
      />
      {!loggedIn && (
        <BottomNavigationAction
          label="Login"
          icon={<LoginIcon />}
          onClick={() => {
            navigate('/login');
          }}
        />
      )}
      {loggedIn && (
        <BottomNavigationAction
          label="Account"
          icon={<AccountCircleIcon />}
          onClick={() => {
            navigate('/me');
          }}
        />
      )}
      <BottomNavigationAction
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
