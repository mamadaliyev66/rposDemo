import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import Waiter screens
import TablesScreen from '../components/Waiter/TablesScreen';
import MenuScreen from '../components/Waiter/MenuScreen';
import OrderHistoryScreen from '../components/Waiter/OrderHistoryScreen';
import OrderScreen from '../components/Waiter/OrderScreen'; // This is the Order Details screen
import UserInfoScreen from '../components/Waiter/UserInfoScreen'; // ADD THIS

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// This component defines the Bottom Tab navigation for the Waiter's main interface
const WaiterTabNavigator = () => {
  return (
   <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;
      if (route.name === 'Tables') {
        iconName = 'table-furniture';
      } else if (route.name === 'MyOrders') {
        iconName = 'history';
      } else if (route.name === 'Profile') {
        iconName = 'account';
      }
      return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#28a745',
    tabBarInactiveTintColor: 'gray',
    headerShown: false,
  })}
>
  <Tab.Screen name="Tables" component={TablesScreen} options={{ title: "Stollar" }} />
  <Tab.Screen name="MyOrders" component={OrderHistoryScreen} options={{ title: "Buyurtmalarim" }} />
  <Tab.Screen name="Profile" component={UserInfoScreen} options={{ title: "Profil" }} />
</Tab.Navigator>
  );
};

// This is the main Stack Navigator for the entire Waiter flow
const WaiterStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="WaiterDashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#28a745', // Green theme
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="WaiterDashboard"
        component={WaiterTabNavigator}
        options={{
          headerShown: false, // Hide header for the screen that contains the tabs
        }}
      />
      <Stack.Screen
        name="MenuScreen"
        component={MenuScreen}
        // This makes the header title dynamic based on the table number passed in params
        options={({ route }) => ({
          title: `Stol #${route.params.tableNumber} - Taomnoma`,
        })}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderScreen}
        options={({ route }) => ({
          title: `Buyurtma Detallari`, // Order Details
        })}
      />
    </Stack.Navigator>
  );
};

export default WaiterStack;