import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useEffect, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import LoginIcon from '@mui/icons-material/Login';
import SearchIcon from '@mui/icons-material/Search';
import ListIcon from '@mui/icons-material/List';
import { useLocation, useNavigate } from 'react-router-dom';

const NavBar: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        setActiveTab(0);
        break;
      case '/login':
        setActiveTab(4);
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
        label="Home"
        icon={<HomeIcon />}
        onClick={() => {
          navigate('/');
        }}
      />
      <BottomNavigationAction label="Search" icon={<SearchIcon />} />
      <BottomNavigationAction label="New" icon={<AddOutlinedIcon />} />
      <BottomNavigationAction label="Lists" icon={<ListIcon />} />
      <BottomNavigationAction
        label="Login"
        icon={<LoginIcon />}
        onClick={() => {
          navigate('/login');
        }}
      />
    </BottomNavigation>
  );
};

export default NavBar;
