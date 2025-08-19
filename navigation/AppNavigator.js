import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

// Import all our main navigator stacks
import AuthNavigator from './AuthNavigator';
import AdminStack from './AdminStack';
import WaiterStack from './WaiterStack';
import CashierStack from './CashierStack';

// Import helper components
import RoleBased from '../components/Shared/RoleBased';
import SplashScreen from '../screens/SplashScreen';

// A simple fallback screen for unrecognized roles
const FallbackScreen = () => (
  <View style={styles.fallbackContainer}>
    <Text style={styles.fallbackText}>Xatolik: Rolingiz aniqlanmadi.</Text>
  </View>
);

const AppNavigator = () => {
  // Get the current authentication state from our hook
  const { user, loading } = useAuth();

  // Show a splash/loading screen while the app checks for a logged-in user
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {/* This is the corrected structure.
        We check for the user object first. If it exists, we then use
        the RoleBased component to render the correct navigator.
      */}
      {!user ? (
        // If no user is logged in, show the authentication screens
        <AuthNavigator />
      ) : (
        // If a user is logged in, use the RoleBased component to show the correct UI
        <RoleBased
          userRole={user.role}
          roles={{
            admin: <AdminStack />,
            waiter: <WaiterStack />,
            cashier: <CashierStack />,
          }}
          fallback={<FallbackScreen />}
        />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
    fallbackContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8d7da',
    },
    fallbackText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#721c24',
    },
});

export default AppNavigator;