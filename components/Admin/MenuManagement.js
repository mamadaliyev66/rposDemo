import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import the screens that will be part of this navigation stack
import MenuListScreen from './MenuManagement/MenuList';
import AddItemScreen from './MenuManagement/AddItem';
import EditItemScreen from './MenuManagement/EditItem';

// Create a new Stack navigator instance
const Stack = createStackNavigator();

const MenuManagementStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MenuList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007bff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false, // Hides the back button title on iOS
      }}
    >
      <Stack.Screen
        name="MenuList"
        component={MenuListScreen}
        options={{
          title: 'Menu Management',
        }}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItemScreen}
        options={{
          title: 'Add New Item',
          // Presentation style can be 'modal' for a different feel
          // presentation: 'modal', 
        }}
      />
      <Stack.Screen
        name="EditItem"
        component={EditItemScreen}
        options={{
          title: 'Edit Item',
        }}
      />
    </Stack.Navigator>
  );
};

export default MenuManagementStack;