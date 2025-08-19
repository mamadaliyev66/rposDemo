import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../../firebase/config';
import { doc, runTransaction, collection, Timestamp } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth'; // To get the current cashier's ID

const PaymentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user } = useAuth(); // Assuming this provides the logged-in user object

  const { order } = route.params; // Get the order passed from OrdersScreen

  const [selectedMethod, setSelectedMethod] = useState('cash'); // 'cash' or 'card'
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
    if (!order) {
      Alert.alert("Error", "Order details are missing.");
      return;
    }

    setLoading(true);

    // Define references to the documents we need to update
    const orderRef = doc(db, 'orders', order.id);
    const tableRef = doc(db, 'tables', order.tableId);
    // Create a reference for a new document in the 'payments' collection
    const newPaymentRef = doc(collection(db, 'payments')); 

    try {
      // Use a Firestore transaction to ensure all writes succeed or none do.
      await runTransaction(db, async (transaction) => {
        // We don't need to 'get' the order document again within the transaction
        // unless we need to verify its current state before proceeding.
        // For this use case, we can proceed directly to writes.

        // 1. Create the new payment document
        transaction.set(newPaymentRef, {
          orderId: order.id,
          amount: order.totalPrice,
          paymentMethod: selectedMethod,
          cashierId: user.uid, // The ID of the currently logged-in cashier
          createdAt: Timestamp.fromDate(new Date()),
        });

        // 2. Update the order status to 'paid'
        transaction.update(orderRef, { 
            status: 'paid',
            completedAt: Timestamp.fromDate(new Date()),
        });

        // 3. Update the table status to 'available'
        transaction.update(tableRef, {
          status: 'available',
          currentOrderId: null, // Clear the order ID from the table
        });
      });

      // If the transaction is successful:
      Alert.alert(
        "Muvaffaqiyatli!",
        "To'lov muvaffaqiyatli amalga oshirildi.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      console.error("Payment Transaction Failed: ", error);
      Alert.alert("Xatolik", "To'lovni amalga oshirishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
        <View style={styles.centered}>
            <Text>Buyurtma ma'lumotlari topilmadi.</Text>
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>To'lovni Tasdiqlash</Text>
        <Text style={styles.tableInfo}>Stol #{order.tableNumber || 'N/A'}</Text>
      </View>

      {/* Order Items List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buyurtma tarkibi</Text>
        {order.items.map(item => (
            <View key={item.itemId} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.quantity} x {item.itemName}</Text>
                <Text style={styles.itemPrice}>{(item.price * item.quantity).toLocaleString('uz-UZ')} UZS</Text>
            </View>
        ))}
      </View>
      
      {/* Total Amount */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Jami Summa:</Text>
        <Text style={styles.totalAmount}>{order.totalPrice.toLocaleString('uz-UZ')} UZS</Text>
      </View>

      {/* Payment Method Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>To'lov usuli</Text>
        <View style={styles.methodContainer}>
            <TouchableOpacity 
                style={[styles.methodButton, selectedMethod === 'cash' && styles.methodButtonSelected]}
                onPress={() => setSelectedMethod('cash')}
            >
                <MaterialIcons name="money" size={24} color={selectedMethod === 'cash' ? '#fff' : '#28a745'} />
                <Text style={[styles.methodText, selectedMethod === 'cash' && styles.methodTextSelected]}>Naqd</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.methodButton, selectedMethod === 'card' && styles.methodButtonSelected]}
                onPress={() => setSelectedMethod('card')}
            >
                <MaterialIcons name="credit-card" size={24} color={selectedMethod === 'card' ? '#fff' : '#007bff'} />
                <Text style={[styles.methodText, selectedMethod === 'card' && styles.methodTextSelected]}>Karta</Text>
            </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity 
        style={[styles.confirmButton, loading && styles.buttonDisabled]} 
        onPress={handleConfirmPayment}
        disabled={loading}
      >
        {loading ? (
            <ActivityIndicator size="small" color="#fff" />
        ) : (
            <Text style={styles.confirmButtonText}>To'lovni Tasdiqlash</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e9ecef' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#343a40' },
  tableInfo: { fontSize: 18, color: '#6c757d', marginTop: 4 },
  section: { marginTop: 20, marginHorizontal: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#495057', marginBottom: 10 },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  itemName: { fontSize: 16, color: '#212529', flex: 1 },
  itemPrice: { fontSize: 16, fontWeight: '500', color: '#212529' },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, marginTop: 10, backgroundColor: '#e9ecef' },
  totalLabel: { fontSize: 20, fontWeight: '600', color: '#495057' },
  totalAmount: { fontSize: 22, fontWeight: 'bold', color: '#007bff' },
  methodContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  methodButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 8, borderWidth: 2, borderColor: '#dee2e6', marginHorizontal: 5 },
  methodButtonSelected: { backgroundColor: '#007bff', borderColor: '#007bff' },
  methodText: { marginLeft: 10, fontSize: 18, fontWeight: 'bold', color: '#212529' },
  methodTextSelected: { color: '#fff' },
  confirmButton: { backgroundColor: '#28a745', margin: 20, padding: 18, borderRadius: 10, alignItems: 'center', elevation: 3 },
  confirmButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  buttonDisabled: { backgroundColor: '#a3d9b1' },
});

export default PaymentScreen;