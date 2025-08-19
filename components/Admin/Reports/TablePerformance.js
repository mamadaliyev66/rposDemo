import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
} from 'react-native';
import { db } from '../../../firebase/config';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

const TablePerformanceScreen = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState({ show: false, type: 'start' });

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setStartDate(firstDay);
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
      // Fetch table info
      const tablesSnapshot = await getDocs(collection(db, 'tables'));
      const tableMap = {};
      tablesSnapshot.forEach(doc => {
        tableMap[doc.id] = doc.data().tableNumber || 'N/A';
      });

      // Fetch orders in range
      const ordersQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate))
      );
      const ordersSnapshot = await getDocs(ordersQuery);

      const stats = {};
      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        if (!order.tableId) return;

        if (!stats[order.tableId]) {
          stats[order.tableId] = {
            tableNumber: tableMap[order.tableId] || `...${order.tableId.slice(-4)}`,
            occupancyCount: 0,
            totalRevenue: 0,
          };
        }

        stats[order.tableId].occupancyCount += 1;
        stats[order.tableId].totalRevenue += order.totalPrice || 0;
      });

      const formatted = Object.keys(stats).map(id => ({
        id,
        ...stats[id],
      })).sort((a, b) => b.totalRevenue - a.totalRevenue);

      setPerformanceData(formatted);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch performance data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker({ show: false, type: showDatePicker.type });
      return;
    }

    const date = selectedDate || (showDatePicker.type === 'start' ? startDate : endDate);
    setShowDatePicker({ show: false, type: showDatePicker.type });

    if (showDatePicker.type === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };

  const renderCard = ({ item, index }) => (
    <View style={styles.card}>
      <View style={styles.rankCircle}>
        <Text style={styles.rank}>{index + 1}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>Stol #{item.tableNumber}</Text>
        <Text style={styles.stat}>
          <MaterialIcons name="event-seat" size={16} color="#6c757d" /> Buyurtmalar: {item.occupancyCount}
        </Text>
        <Text style={styles.stat}>
          <MaterialIcons name="monetization-on" size={16} color="#28a745" /> Tushum: {item.totalRevenue.toLocaleString('uz-UZ')} UZS
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 Stollar Hisoboti</Text>

      <View style={styles.dateFilter}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker({ show: true, type: 'start' })}>
          <Text style={styles.dateText}>Boshlanish: {startDate.toLocaleDateString('uz-UZ')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker({ show: true, type: 'end' })}>
          <Text style={styles.dateText}>Tugash: {endDate.toLocaleDateString('uz-UZ')}</Text>
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
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      ) : (
        <FlatList
          data={performanceData}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          ListEmptyComponent={<Text style={styles.empty}>Ma'lumot yo'q</Text>}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#343a40', textAlign: 'center', marginVertical: 15 },
  dateFilter: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  dateButton: { backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6' },
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
    shadowRadius: 4,
    alignItems: 'center',
  },
  rankCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rank: { fontWeight: 'bold', color: '#007bff', fontSize: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#343a40' },
  stat: { fontSize: 14, color: '#495057', marginVertical: 2 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { textAlign: 'center', color: '#6c757d', marginTop: 20 },
});

export default TablePerformanceScreen;
