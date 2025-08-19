import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { db } from '../../firebase/config';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';

const DailyTransactionsScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const todayString = new Date().toLocaleDateString('uz-UZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const paymentsRef = collection(db, 'payments');
    const q = query(
      paymentsRef,
      where('createdAt', '>=', Timestamp.fromDate(startOfToday)),
      where('createdAt', '<=', Timestamp.fromDate(endOfToday)),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedTransactions = [];
        let currentTotal = 0;

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          fetchedTransactions.push({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt.toDate(),
          });
          currentTotal += data.amount;
        });

        setTransactions(fetchedTransactions);
        setTotalRevenue(currentTotal);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching daily transactions: ', error);
        setLoading(false);
        Alert.alert('Xatolik', "Kunlik tushumlarni olib bo'lmadi.");
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = (id) => {
    Alert.alert(
      'Tasdiqlash',
      "Ushbu tranzaksiyani o'chirishni xohlaysizmi?",
      [
        { text: 'Yo‘q', style: 'cancel' },
        {
          text: 'Ha',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'payments', id));
            } catch (err) {
              Alert.alert('Xatolik', "O‘chirib bo‘lmadi.");
            }
          },
        },
      ]
    );
  };

  const renderTransactionItem = ({ item }) => {
    if (filter !== 'all' && item.paymentMethod !== filter) return null;

    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          item.amount > 500000 && { backgroundColor: '#fff8e1' },
        ]}
        onLongPress={() => handleDelete(item.id)}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: item.paymentMethod === 'card' ? '#007bff' : '#28a745' },
          ]}
        >
          <MaterialIcons
            name={item.paymentMethod === 'card' ? 'credit-card' : 'money'}
            size={24}
            color="#fff"
          />
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemOrderId}>Buyurtma: ...{item.orderId.slice(-6)}</Text>
          <Text style={styles.itemTime}>{item.createdAt.toLocaleTimeString('uz-UZ')}</Text>
        </View>
        <Text style={styles.itemAmount}>{item.amount.toLocaleString('uz-UZ')} UZS</Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Ma'lumotlar yuklanmoqda...</Text>
      </View>
    );
  }

  const totalCount = transactions.length;
  const avgAmount = totalCount > 0 ? (totalRevenue / totalCount).toFixed(0) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bugungi Tushumlar</Text>
        <Text style={styles.headerDate}>{todayString}</Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Jami Tushum</Text>
        <Text style={styles.summaryTotal}>{totalRevenue.toLocaleString('uz-UZ')} UZS</Text>
        <Text style={styles.summarySmall}>
          Tranzaksiya soni: {totalCount} | O‘rtacha: {avgAmount.toLocaleString('uz-UZ')} UZS
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterRow}>
        {['all', 'card', 'cash'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              filter === type && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(type)}
          >
            <Text
              style={[
                styles.filterText,
                filter === type && styles.filterTextActive,
              ]}
            >
              {type === 'all'
                ? 'Barchasi'
                : type === 'card'
                ? 'Karta'
                : 'Naqd'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.listHeader}>Tranzaksiyalar</Text>}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Bugun uchun to'lovlar mavjud emas.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#343a40', textAlign: 'center' },
  headerDate: { fontSize: 16, color: '#6c757d', textAlign: 'center', marginTop: 4 },
  summaryCard: {
    backgroundColor: '#007bff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  summaryLabel: { fontSize: 18, color: '#e0e0e0' },
  summaryTotal: { fontSize: 36, fontWeight: 'bold', color: '#fff', marginTop: 5 },
  summarySmall: { fontSize: 14, color: '#e0e0e0', marginTop: 5 },
  filterRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    marginHorizontal: 5,
  },
  filterButtonActive: { backgroundColor: '#007bff' },
  filterText: { color: '#495057', fontSize: 14 },
  filterTextActive: { color: '#fff' },
  listContainer: { paddingHorizontal: 15 },
  listHeader: { fontSize: 20, fontWeight: 'bold', color: '#495057', marginBottom: 10, marginTop: 10 },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemDetails: { flex: 1 },
  itemOrderId: { fontSize: 16, fontWeight: '600', color: '#343a40' },
  itemTime: { fontSize: 14, color: '#6c757d' },
  itemAmount: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  emptyText: { fontSize: 16, color: '#6c757d', textAlign: 'center', marginTop: 20 },
});

export default DailyTransactionsScreen;
