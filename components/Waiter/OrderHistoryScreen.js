import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { db } from '../../firebase/config';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker';

const STATUS_FILTERS = [
  { key: 'all', label: 'Barchasi' },
  { key: 'new', label: 'Yangi' },
  { key: 'preparing', label: 'Tayyorlanmoqda' },
  { key: 'served', label: 'Yetkazildi' },
  { key: 'paid', label: "To'landi" },
];

const OrderHistoryScreen = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = useCallback(() => {
    if (!user || !user.uid) {
      setLoading(false);
      return;
    }

    const startOfDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      0, 0, 0
    );
    const endOfDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      23, 59, 59
    );

    let q = query(
      collection(db, 'orders'),
      where('waiterId', '==', user.uid),
      where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
      where('createdAt', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedOrders.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
          });
        });

        if (statusFilter !== 'all') {
          fetchedOrders = fetchedOrders.filter(
            (o) => o.status === statusFilter
          );
        }

        setOrders(fetchedOrders);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error('Error fetching order history: ', error);
        setLoading(false);
        setRefreshing(false);
        Alert.alert('Xatolik', "Buyurtmalar tarixini yuklab bo'lmadi.");
      }
    );

    return () => unsubscribe();
  }, [user, selectedDate, statusFilter]);

  useEffect(() => {
    const unsubscribe = fetchOrders();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchOrders]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'new':
        return { text: 'Yangi', icon: 'fiber-new', color: '#007bff' };
      case 'preparing':
        return { text: 'Tayyorlanmoqda', icon: 'restaurant-menu', color: '#ffc107' };
      case 'served':
        return { text: 'Yetkazildi', icon: 'room-service', color: '#28a745' };
      case 'paid':
        return { text: "To'landi", icon: 'check-circle', color: '#6c757d' };
      default:
        return { text: 'Nomaʼlum', icon: 'help-outline', color: '#6c757d' };
    }
  };

  const renderOrderCard = ({ item, index }) => {
    const statusInfo = getStatusInfo(item.status);
    return (
      <Animatable.View
        animation="fadeInUp"
        delay={index * 100}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.tableText}>Stol #{item.tableNumber}</Text>
          <Text style={styles.timeText}>
            {item.createdAt.toLocaleTimeString('uz-UZ', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <View style={styles.cardBody}>
          {item.items.map((menuItem, idx) => (
            <Text key={idx} style={styles.itemText}>
              - {menuItem.quantity} x {menuItem.itemName}
            </Text>
          ))}
        </View>
        <View style={styles.cardFooter}>
          <View
            style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}
          >
            <MaterialIcons name={statusInfo.icon} size={16} color="#fff" />
            <Text style={styles.statusText}>{statusInfo.text}</Text>
          </View>
          <Text style={styles.totalAmount}>
            {item.totalPrice.toLocaleString('uz-UZ')} UZS
          </Text>
        </View>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Date picker & filter */}
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <MaterialIcons name="calendar-today" size={20} color="#007bff" />
          <Text style={styles.dateButtonText}>
            {selectedDate.toLocaleDateString('uz-UZ')}
          </Text>
        </TouchableOpacity>
        <FlatList
          horizontal
          data={STATUS_FILTERS}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                statusFilter === item.key && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter(item.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === item.key && { color: '#fff' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchOrders();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <MaterialIcons name="playlist-add" size={80} color="#e0e0e0" />
              <Text style={styles.emptyText}>
                Ushbu kunda buyurtmalar topilmadi.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  dateButtonText: { marginLeft: 6, fontSize: 16, color: '#007bff' },
  filterChip: {
    borderWidth: 1,
    borderColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: '#007bff' },
  filterChipText: { fontSize: 14, color: '#007bff' },
  listContainer: { paddingHorizontal: 10, paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tableText: { fontSize: 20, fontWeight: 'bold', color: '#212529' },
  timeText: { fontSize: 14, color: '#6c757d' },
  cardBody: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemText: { fontSize: 16, color: '#495057', lineHeight: 24 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: '#007bff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontSize: 18, color: '#6c757d', marginTop: 20, textAlign: 'center' },
});

export default OrderHistoryScreen;
