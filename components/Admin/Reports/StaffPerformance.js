import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import { db } from '../../../firebase/config';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

const StaffPerformanceScreen = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState({ show: false, type: 'start' });

  useEffect(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(startOfMonth);
    setEndDate(today);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchPerformanceData();
    }
  }, [startDate, endDate]);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const waitersQuery = query(collection(db, 'users'), where('role', '==', 'waiter'));
      const waitersSnapshot = await getDocs(waitersQuery);
      const waiterMap = {};
      waitersSnapshot.forEach(doc => {
        waiterMap[doc.id] = doc.data().displayName || 'Unnamed Waiter';
      });

      const ordersQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate))
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      const performanceStats = {};
      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        const waiterId = order.waiterId;
        if (!waiterId) return;

        if (!performanceStats[waiterId]) {
          performanceStats[waiterId] = {
            waiterName: waiterMap[waiterId] || 'Unknown Waiter',
            totalOrders: 0,
            totalSales: 0,
          };
        }
        performanceStats[waiterId].totalOrders += 1;
        performanceStats[waiterId].totalSales += order.totalPrice || 0;
      });

      const formattedData = Object.keys(performanceStats)
        .map(waiterId => ({
          id: waiterId,
          ...performanceStats[waiterId],
        }))
        .sort((a, b) => b.totalSales - a.totalSales);

      setPerformanceData(formattedData);
    } catch (error) {
      console.error("Error fetching performance data: ", error);
      Alert.alert("Error", "Could not fetch performance data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS !== 'ios') {
      setShowDatePicker({ show: false, type: showDatePicker.type });
    }
    if (selectedDate) {
      if (showDatePicker.type === 'start') {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const renderPerformanceCard = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.rankContainer}>
        <Text style={styles.rank}>{index + 1}</Text>
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{item.waiterName}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.stat}>
            <MaterialIcons name="receipt-long" size={16} color="#6c757d" /> Total Orders: {item.totalOrders}
          </Text>
          <Text style={styles.stat}>
            <MaterialIcons name="monetization-on" size={16} color="#28a745" /> Total Sales: {item.totalSales.toLocaleString('uz-UZ')} UZS
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Staff Performance</Text>

      <View style={styles.dateFilterContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker({ show: true, type: 'start' })}>
          <Text style={styles.dateText}>From: {startDate.toLocaleDateString('uz-UZ')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker({ show: true, type: 'end' })}>
          <Text style={styles.dateText}>To: {endDate.toLocaleDateString('uz-UZ')}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker.show && (
        <DateTimePicker
          value={showDatePicker.type === 'start' ? startDate : endDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={performanceData}
          keyExtractor={(item) => item.id}
          renderItem={renderPerformanceCard}
          contentContainerStyle={{ padding: 10 }}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No performance data found for this period.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  header: { fontSize: 26, fontWeight: 'bold', color: '#343a40', padding: 20, textAlign: 'center' },
  dateFilterContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10, marginBottom: 15 },
  dateButton: { backgroundColor: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', width: '48%', alignItems: 'center' },
  dateText: { fontSize: 14, color: '#495057' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center'
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  cardDetails: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 8,
  },
  statsContainer: {},
  stat: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default StaffPerformanceScreen;
