import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * A custom hook to provide easy access to the AppContext.
 * It simplifies consuming the localization state and functions (like the 't' function).
 *
 * @returns {object} The app context value (locale, t, changeLocale).
 */
export const useLocalization = () => {
  const context = useContext(AppContext);

  // This check ensures the hook is used within the AppProvider's scope.
  if (context === undefined) {
    throw new Error('useLocalization() must be used inside an AppProvider');
  }

  return context;
};