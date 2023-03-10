import useLoggedIn from '../hooks/useLoggedIn';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import LoginIcon from '@mui/icons-material/Login';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import {
  useEffect,
  useState,
} from 'react';
import {
  useTranslation,
} from 'react-i18next';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

const NavBar: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [
    activeTab,
    setActiveTab,
  ] = useState(0);
  const location = useLocation();
  const loggedIn = useLoggedIn();
  const minWidthIcon = '50px';
  const paddingIcons = 0.1;
  const {
    t,
  } = useTranslation('navbar');

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
  }, [
    location,
  ]);

  return (
    <BottomNavigation
      onChange={(event, newIndex) => {
        setActiveTab(newIndex);
      }}
      showLabels
      value={activeTab}
    >
      <BottomNavigationAction
        icon={<HomeIcon />}
        label={t('home')}
        onClick={() => {
          navigate('/');
        }}
        sx={{
          minWidth: minWidthIcon,
          px: paddingIcons,
        }}
      />
      <BottomNavigationAction
        icon={<ListIcon />}
        label={t('lists')}
        onClick={() => {
          navigate('/lists');
        }}
        sx={{
          minWidth: minWidthIcon,
          px: paddingIcons,
        }}
      />
      <BottomNavigationAction
        disabled={!loggedIn}
        icon={<AddOutlinedIcon />}
        label={t('create')}
        onClick={() => {
          navigate('/create');
        }}
        sx={{
          minWidth: minWidthIcon,
          px: paddingIcons,
        }}
      />
      {!loggedIn &&
      <BottomNavigationAction
        icon={<LoginIcon />}
        label={t('login')}
        onClick={() => {
          navigate('/login');
        }}
        sx={{
          minWidth: minWidthIcon,
          px: paddingIcons,
        }}
      />}
      {loggedIn &&
      <BottomNavigationAction
        icon={<AccountCircleIcon />}
        label={t('account')}
        onClick={() => {
          navigate('/me');
        }}
        sx={{
          minWidth: minWidthIcon,
          px: paddingIcons,
        }}
      />}
      <BottomNavigationAction
        icon={<SettingsIcon />}
        label={t('settings')}
        onClick={() => {
          navigate('/settings');
        }}
        sx={{
          minWidth: minWidthIcon,
          px: paddingIcons,
        }}
      />
    </BottomNavigation>
  );
};

export default NavBar;
