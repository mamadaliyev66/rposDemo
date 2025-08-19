import React from 'react';
import { StatusBar } from 'expo-status-bar';

// Import our master navigator
import AppNavigator from './navigation/AppNavigator';

// Import our context providers
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

/**
 * The root component of the entire application.
 * It sets up the context providers that wrap the entire navigation stack.
 */
export default function App() {
  return (
    // AuthProvider must wrap everything so the entire app knows the user's login state.
    <AuthProvider>
      {/* AppProvider provides localization (language) and other general app settings. */}
      <AppProvider>
        {/* AppNavigator is the main navigation logic of the app. */}
        <AppNavigator />
        
        <StatusBar style="auto" />
      </AppProvider>
    </AuthProvider>
  );
}