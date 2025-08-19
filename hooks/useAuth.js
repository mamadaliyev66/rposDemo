import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * A custom hook to provide easy access to the AuthContext.
 * It simplifies consuming the authentication state and functions in components.
 *
 * @returns {object} The authentication context value (user, loading, error, login, logout, etc.).
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // This is a developer-friendly check. If a component that is not
  // wrapped in AuthProvider tries to use this hook, it will get a clear error.
  if (context === undefined) {
    throw new Error('useAuth() must be used inside an AuthProvider');
  }

  return context;
};