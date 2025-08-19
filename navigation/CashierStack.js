import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// We are now importing from '@react-navigation/native-stack'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

// Import Cashier screens
import OrdersScreen from '../components/Cashier/OrdersScreen';
import PaymentScreen from '../components/Cashier/PaymentScreen';
import DailyTransactions from '../components/Cashier/DailyTransactions';
import UserInfoScreen from '../components/Cashier/UserInfoScreen'; // ✅ NEW

// This creates a NATIVE stack navigator
const Stack = createNativeStackNavigator();

/**
 * The home screen dashboard for the Cashier.
 */
const CashierHomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kassir Paneli</Text>
      <Text style={styles.subtitle}>Kerakli bo'limni tanlang</Text>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('Orders')}
      >
        <MaterialIcons name="receipt-long" size={32} color="#fff" />
        <Text style={styles.menuButtonText}>Faol Buyurtmalar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={() => navigation.navigate('DailyTransactions')}
      >
        <MaterialIcons name="assessment" size={32} color="#fff" />
        <Text style={styles.menuButtonText}>Bugungi Hisobot</Text>
      </TouchableOpacity>
      <TouchableOpacity 
  style={styles.menuButton} 
  onPress={() => navigation.navigate('Profile')}
>
  <MaterialIcons name="person" size={32} color="#fff" />
  <Text style={styles.menuButtonText}>Profil</Text>
</TouchableOpacity>
      
    </View>
  );
};

/**
 * The main Native Stack Navigator for the entire Cashier flow.
 */
const CashierStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="CashierHome"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007bff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
  name="Profile"
  component={UserInfoScreen}
  options={{
    title: "Foydalanuvchi Profil",
  }}
/>
      <Stack.Screen
        name="CashierHome"
        component={CashierHomeScreen}
        options={{
          title: "Bosh Sahifa", // Home
        }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          title: "To'lov Uchun Buyurtmalar", // Orders for Payment
        }}
      />
      <Stack.Screen
        name="DailyTransactions"
        component={DailyTransactions}
        options={{
          title: "Kunlik Hisobot", // Daily Report
        }}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          title: "To'lov", // Payment
          presentation: 'modal', // Makes the screen slide up from the bottom
        }}
      />
    </Stack.Navigator>
  );
};

// Styles for the dashboard screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#6c757d',
        marginBottom: 30,
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007bff',
        padding: 25,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 4,
    },
    menuButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 15,
    },
});

export default CashierStack;