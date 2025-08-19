import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const OrdersScreen = () => {
  const navigation = useNavigation();
  const [activeOrders, setActiveOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      where('status', 'in', ['preparing', 'served']),         
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedOrders = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedOrders.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
          });
        });
        setActiveOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error('Error fetching active orders: ', error);
        setLoading(false);
        setRefreshing(false);
        Alert.alert("Xatolik", "Faol buyurtmalarni olib bo'lmadi.");
      }
    );

    return () => unsubscribe();
  }, []);

  const handleSelectOrder = (order) => {
    navigation.navigate('PaymentScreen', { order });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'preparing':
        return { backgroundColor: '#ffc107', color: '#212529', text: 'Tayyorlanmoqda' };
      case 'served':
        return { backgroundColor: '#28a745', color: '#fff', text: 'Yetkazildi' };
      default:
        return { backgroundColor: '#6c757d', color: '#fff', text: 'Noma\'lum' };
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredOrders(activeOrders);
    } else {
      const lower = text.toLowerCase();
      setFilteredOrders(
        activeOrders.filter(
          (order) =>
            (order.tableNumber && order.tableNumber.toString().includes(lower)) ||
            order.id.toLowerCase().includes(lower)
        )
      );
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Firestore snapshot listener handles actual updates
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const renderOrderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);
    return (
      <TouchableOpacity style={styles.card} onPress={() => handleSelectOrder(item)}>
        <View style={styles.cardHeader}>
          <Text style={styles.tableText}>Stol #{item.tableNumber || 'N/A'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>{statusStyle.text}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.totalLabel}>Umumiy summa:</Text>
          <Text style={styles.totalAmount}>{item.totalPrice.toLocaleString('uz-UZ')} UZS</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.timeText}>
            <MaterialIcons name="timer" size={14} color="#6c757d" />{' '}
            {item.createdAt.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <MaterialIcons name="chevron-right" size={28} color="#007bff" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Faol buyurtmalar yuklanmoqda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={22} color="#6c757d" />
        <TextInput
          placeholder="Buyurtma ID yoki Stol raqami..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.header}>To'lov Uchun Buyurtmalar</Text>}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076549.png' }}
              style={{ width: 100, height: 100, opacity: 0.4 }}
            />
            <Text style={styles.emptyText}>Hozircha to'lov uchun buyurtmalar yo'q.</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#343a40', padding: 20, textAlign: 'center' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: { flex: 1, paddingVertical: 8, paddingHorizontal: 5, fontSize: 16 },
  listContainer: { paddingHorizontal: 10, paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  tableText: { fontSize: 20, fontWeight: 'bold', color: '#212529' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15 },
  statusText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  cardBody: { paddingVertical: 20, alignItems: 'center' },
  totalLabel: { fontSize: 16, color: '#6c757d' },
  totalAmount: { fontSize: 30, fontWeight: 'bold', color: '#007bff', marginTop: 5 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timeText: { fontSize: 14, color: '#6c757d' },
  emptyText: { fontSize: 18, color: '#6c757d', marginTop: 15, textAlign: 'center' },
});

export default OrdersScreen;
