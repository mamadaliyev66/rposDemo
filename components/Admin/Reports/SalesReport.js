import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  FlatList,
} from 'react-native';
import { db } from '../../../firebase/config';
import { collection, query, where, getDocs, orderBy, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

// Get screen width for chart
const screenWidth = Dimensions.get('window').width;

const SalesReportScreen = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  const [showDatePicker, setShowDatePicker] = useState({ show: false, type: 'start' });

  // Set default date range to today
  useEffect(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    setStartDate(startOfToday);
    setEndDate(endOfToday);
  }, []);

  // Fetch data whenever the date range changes
  useEffect(() => {
    fetchSalesReport();
  }, [startDate, endDate]);

  const fetchSalesReport = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    
    try {
      const paymentsRef = collection(db, 'payments');
      const q = query(
        paymentsRef,
        orderBy('createdAt', 'desc'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate))
      );
      
      const querySnapshot = await getDocs(q);
      const fetchedPayments = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt.toDate(),
      }));
      
      setPayments(fetchedPayments);
    } catch (error) {
      console.error("Error fetching sales report: ", error);
      Alert.alert("Error", "Could not fetch sales data.");
    } finally {
      setLoading(false);
    }
  };

  const deletePayment = (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "payments", id));
              setPayments(prev => prev.filter(p => p.id !== id));
              Alert.alert("Deleted", "Transaction has been deleted.");
            } catch (error) {
              console.error("Error deleting transaction: ", error);
              Alert.alert("Error", "Could not delete transaction.");
            }
          }
        }
      ]
    );
  };

  const summaryData = useMemo(() => {
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalTransactions = payments.length;
    const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    
    return {
      totalRevenue,
      totalTransactions,
      averageTransactionValue,
    };
  }, [payments]);

  const chartData = useMemo(() => {
    if (payments.length === 0) {
      return { labels: [], datasets: [{ data: [] }] };
    }
    
    const salesByDay = {};
    payments.forEach(payment => {
      const day = payment.createdAt.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit' });
      salesByDay[day] = (salesByDay[day] || 0) + payment.amount;
    });

    const labels = Object.keys(salesByDay).reverse();
    const data = Object.values(salesByDay).reverse();

    return { labels, datasets: [{ data }] };
  }, [payments]);
  
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || (showDatePicker.type === 'start' ? startDate : endDate);
    setShowDatePicker({ show: false, type: showDatePicker.type });
    if (showDatePicker.type === 'start') {
      setStartDate(currentDate);
    } else {
      setEndDate(currentDate);
    }
  };

  const renderSummaryCard = (title, value, formatAsCurrency = true) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>
        {formatAsCurrency
          ? value.toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS' })
          : value}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Sales Report</Text>

      <View style={styles.dateFilterContainer}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker({ show: true, type: 'start' })}>
          <MaterialIcons name="date-range" size={20} color="#495057" />
          <Text style={styles.dateText}>From: {startDate.toLocaleDateString('uz-UZ')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker({ show: true, type: 'end' })}>
           <MaterialIcons name="date-range" size={20} color="#495057" />
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
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 50 }}/>
      ) : (
        <>
          <View style={styles.summaryContainer}>
            {renderSummaryCard("Total Revenue", summaryData.totalRevenue)}
            {renderSummaryCard("Total Transactions", summaryData.totalTransactions, false)}
            {renderSummaryCard("Avg. Transaction", Math.round(summaryData.averageTransactionValue))}
          </View>
          
          <View style={styles.chartContainer}>
            <Text style={styles.sectionHeader}>Sales Trend</Text>
            {payments.length > 0 ? (
                <LineChart
                    data={chartData}
                    width={screenWidth - 20}
                    height={220}
                    yAxisLabel=""
                    yAxisInterval={1}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    formatYLabel={(y) => `${(parseFloat(y) / 1000).toFixed(0)}k`}
                />
            ) : (
                <Text style={styles.noDataText}>No sales data for the selected period.</Text>
            )}
          </View>
          
          <View style={styles.listContainer}>
            <Text style={styles.sectionHeader}>Transactions</Text>
            <FlatList
              data={payments}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.transactionItem}>
                  <View>
                    <Text style={styles.transactionId}>Order ID: ...{item.orderId.slice(-6)}</Text>
                    <Text style={styles.transactionDate}>{item.createdAt.toLocaleString('uz-UZ')}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.transactionAmount}>{item.amount.toLocaleString('uz-UZ', { style: 'currency', currency: 'UZS' })}</Text>
                    <TouchableOpacity onPress={() => deletePayment(item.id)}>
                      <MaterialIcons name="delete" size={20} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(73, 80, 87, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: '4', strokeWidth: '2', stroke: '#007bff' },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  header: { fontSize: 26, fontWeight: 'bold', color: '#343a40', padding: 20, textAlign: 'center' },
  dateFilterContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10, marginBottom: 15 },
  dateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6' },
  dateText: { marginLeft: 8, fontSize: 14, color: '#495057' },
  summaryContainer: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', paddingHorizontal: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, alignItems: 'center', width: '48%', marginBottom: 10, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  cardTitle: { fontSize: 14, color: '#6c757d', marginBottom: 5 },
  cardValue: { fontSize: 18, fontWeight: 'bold', color: '#007bff' },
  chartContainer: { alignItems: 'center', marginVertical: 10, backgroundColor: '#fff', borderRadius: 16, padding: 10, marginHorizontal: 10, elevation: 2 },
  chart: { marginVertical: 8, borderRadius: 16 },
  noDataText: { padding: 30, color: '#6c757d' },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', color: '#495057', marginBottom: 10, paddingLeft: 5 },
  listContainer: { marginHorizontal: 10, backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 30, elevation: 2 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  transactionId: { fontSize: 14, color: '#495057' },
  transactionDate: { fontSize: 12, color: '#adb5bd' },
  transactionAmount: { fontSize: 16, fontWeight: 'bold', color: '#28a745' },
});

export default SalesReportScreen;
