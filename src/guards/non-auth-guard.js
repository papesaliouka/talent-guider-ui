import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useAuthContext } from 'src/contexts/auth-context';

export const NonAuthGuard = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (router.isReady && isAuthenticated) {
      console.log('User is authenticated, redirecting');
      router.replace('/'); // Redirect authenticated user to a different route
    }
  }, [router.isReady]);

  return isAuthenticated ? null : children;
};

NonAuthGuard.propTypes = {
  children: PropTypes.node,
};