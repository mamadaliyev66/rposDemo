import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';

// Import the screens that will be part of this navigation stack
import UserListScreen from './UserManagement/UserList';
import AddUserScreen from './UserManagement/AddUser';
import UserRolesScreen from './UserManagement/UserRoles';

// Create a new Stack navigator instance
const Stack = createStackNavigator();

const UserManagementStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="UserList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#343a40', // A different color for this section
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="UserList"
        component={UserListScreen}
        options={({ navigation }) => ({ // Use function to get access to navigation
          title: 'User Management',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('UserRoles')}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="admin-panel-settings" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="AddUser"
        component={AddUserScreen}
        options={{
          title: 'Add New User',
        }}
      />
      <Stack.Screen
        name="UserRoles"
        component={UserRolesScreen}
        options={{
          title: 'Manage User Roles',
        }}
      />
    </Stack.Navigator>
  );
};

export default UserManagementStack;