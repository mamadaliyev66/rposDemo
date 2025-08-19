import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Import the Admin feature navigators and screens
import HomeScreen from '../screens/HomeScreen';
import MenuManagementStack from '../components/Admin/MenuManagement';
import UserManagementStack from '../components/Admin/UserManagement';
import ReportsStack from '../components/Admin/ReportsScreen';
import SettingsScreen from '../components/Admin/Settings';

// Create the Bottom Tab Navigator instance
const Tab = createBottomTabNavigator();

const AdminStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        // This function determines which icon to show for each tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'dashboard' : 'dashboard-outline';
              break;
            case 'MenuTab':
              iconName = 'restaurant-menu';
              break;
            case 'UsersTab':
              iconName = 'people';
              break;
            case 'ReportsTab':
              iconName = 'bar-chart';
              break;
            case 'SettingsTab':
              iconName = 'settings';
              break;
            default:
              iconName = 'circle';
              break;
          }
          // Using MaterialIcons, but you can switch to MaterialCommunityIcons for 'dashboard-outline'
          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        // Style settings for the tab bar
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#e0e0e0',
            paddingTop: 5,
            height: 60,
            paddingBottom: 5,
        },
        // Hide the header by default. Screens that need one will enable it themselves.
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: "Bosh Sahifa", // Home
        }}
      />
      <Tab.Screen
        name="MenuTab"
        component={MenuManagementStack}
        options={{
          title: 'Taomnoma', // Menu
        }}
      />
      <Tab.Screen
        name="UsersTab"
        component={UserManagementStack}
        options={{
          title: 'Xodimlar', // Staff
        }}
      />
      <Tab.Screen
        name="ReportsTab"
        component={ReportsStack}
        options={{
          title: 'Hisobotlar', // Reports
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: 'Sozlamalar', // Settings
          // Since Settings is a single screen, we show its header here
          headerShown: true,
          headerStyle: { backgroundColor: '#343a40' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminStack;