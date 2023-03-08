import { useEffect, useState } from 'react';
import { authenticationManager } from '../services/AuthenticationManager';

const useLoggedIn = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (authenticationManager.hasUser() && !loggedIn) setLoggedIn(true);
        if (!authenticationManager.hasUser() && loggedIn) setLoggedIn(false);
    });

    return loggedIn;
};

export default useLoggedIn;
