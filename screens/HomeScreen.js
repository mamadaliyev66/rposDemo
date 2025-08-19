import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import RoleBased from '../components/Shared/RoleBased';
import { MaterialIcons } from '@expo/vector-icons';

// A simple helper to get a greeting based on the time of day
const getGreeting = (hours) => {
  if (hours < 12) return "Xayrli tong"; // Good Morning
  if (hours < 18) return "Xayrli kun";   // Good Afternoon
  return "Xayrli kech";      // Good Evening
};

// --- Role-Specific Quick Action Components ---
const AdminActions = ({ navigation }) => (
  <>
    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('MenuTab', { screen: 'AddItem' })}>
      <MaterialIcons name="playlist-add" size={32} color="#fff" />
      <Text style={styles.actionText}>Yangi Taom Qo'shish</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('ReportsTab')}>
      <MaterialIcons name="bar-chart" size={32} color="#fff" />
      <Text style={styles.actionText}>Hisobotlarni Ko'rish</Text>
    </TouchableOpacity>
  </>
);

const WaiterActions = ({ navigation }) => (
  <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Tables')}>
    <MaterialIcons name="apps" size={32} color="#fff" />
    <Text style={styles.actionText}>Stollarni Ko'rish</Text>
  </TouchableOpacity>
);

const CashierActions = ({ navigation }) => (
  <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Orders')}>
    <MaterialIcons name="receipt-long" size={32} color="#fff" />
    <Text style={styles.actionText}>Faol Buyurtmalar</Text>
  </TouchableOpacity>
);
// --- End of Quick Action Components ---


const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    // Clear the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting(currentTime.getHours());
  const formattedTime = currentTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

  return (
    <ImageBackground 
        source={require('../assets/splash-icon.png')} // Optional: a subtle background
        style={styles.background}
        blurRadius={20} // Blur the background for a modern glass effect
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}, {user?.displayName?.split(' ')[0]}!</Text>
          <Text style={styles.time}>{formattedTime}</Text>
        </View>

        <View style={styles.content}>
            <Text style={styles.roleText}>Sizning rolingiz: <Text style={styles.roleBadge}>{t(`common.${user?.role}`)}</Text></Text>

            <View style={styles.actionsContainer}>
                <RoleBased
                    userRole={user?.role}
                    roles={{
                        admin: <AdminActions navigation={navigation} />,
                        waiter: <WaiterActions navigation={navigation} />,
                        cashier: <CashierActions navigation={navigation} />,
                    }}
                />
            </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width:'100%',
    height:'100%'
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Dark overlay for better text contrast
  },
  header: {
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  greeting: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },
  time: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  content: {
      flex: 1,
      padding: 30,
  },
  roleText: {
      fontSize: 18,
      color: 'rgba(255,255,255,0.8)',
      marginBottom: 30,
  },
  roleBadge: {
      fontWeight: 'bold',
      color: '#fff',
  },
  actionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
  },
  actionCard: {
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 16,
      width: '100%',
      padding: 20,
      marginBottom: 20,
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
  },
  actionText: {
      fontSize: 18,
      fontWeight: '600',
      color: '#fff',
      marginTop: 10,
  },
});

export default HomeScreen;