import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { db } from '../../firebase/config';
import { doc, onSnapshot, updateDoc, collection, getDocs } from 'firebase/firestore';
import OrderItem from '../Shared/OrderItem';
import { MaterialIcons } from '@expo/vector-icons';

const OrderScreen = () => {
  const route = useRoute();
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [menu, setMenu] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch menu
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const snap = await getDocs(collection(db, 'menu'));
        const items = [];
        snap.forEach(docSnap => {
          items.push({ id: docSnap.id, ...docSnap.data() });
        });
        setMenu(items);
      } catch (err) {
        console.error(err);
        Alert.alert("Xatolik", "Menyu yuklanmadi.");
      }
    };
    fetchMenu();
  }, []);

  // Live order listener
  useEffect(() => {
    if (!orderId) {
      Alert.alert("Xatolik", "Buyurtma ID topilmadi.");
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(doc(db, 'orders', orderId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setOrder({
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
        });
      } else {
        Alert.alert("Topilmadi", "Buyurtma mavjud emas.");
        setOrder(null);
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      Alert.alert("Xatolik", "Buyurtma maʼlumotlari yuklanmadi.");
      setLoading(false);
    });

    return () => unsub();
  }, [orderId]);

  const getStatusInfo = (status) => {
    switch (status) {
      case 'new': return { text: 'Yangi', icon: 'fiber-new', color: '#007bff' };
      case 'preparing': return { text: 'Tayyorlanmoqda', icon: 'soup-kitchen', color: '#ffc107' };
      case 'served': return { text: 'Yetkazildi', icon: 'room-service', color: '#28a745' };
      case 'paid': return { text: "To'landi", icon: 'check-circle', color: '#6c757d' };
      default: return { text: 'Noma\'lum', icon: 'help-outline', color: '#6c757d' };
    }
  };

  const handleAddToOrder = (menuItem) => {
    if (order.status !== 'new') return;
    const existing = order.items.find(i => i.itemName === menuItem.name);
    let updatedItems;
    if (existing) {
      updatedItems = order.items.map(i =>
        i.itemName === menuItem.name ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      updatedItems = [...order.items, { itemName: menuItem.name, quantity: 1, price: menuItem.price }];
    }
    setOrder({ ...order, items: updatedItems, totalPrice: calcTotal(updatedItems) });
  };

  const handleQuantityChange = (itemName, delta) => {
    const updated = order.items
      .map(i => i.itemName === itemName ? { ...i, quantity: i.quantity + delta } : i)
      .filter(i => i.quantity > 0);
    setOrder({ ...order, items: updated, totalPrice: calcTotal(updated) });
  };

  const calcTotal = (items) => {
    return items.reduce((sum, i) => sum + i.quantity * i.price, 0);
  };

  const handleSendToKitchen = async () => {
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        items: order.items,
        totalPrice: order.totalPrice,
        status: 'preparing'
      });
      Alert.alert("Yuborildi", "Buyurtma oshxonaga yuborildi.");
    } catch (err) {
      console.error(err);
      Alert.alert("Xatolik", "Buyurtma yuborilmadi.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={styles.centered} />;
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text>Buyurtma topilmadi.</Text>
      </View>
    );
  }

  const statusInfo = getStatusInfo(order.status);

  const filteredMenu = menu.filter(m =>
    (!selectedCategory || m.category === selectedCategory) &&
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buyurtma Detallari</Text>
        <Text style={styles.tableText}>Stol #{order.tableNumber}</Text>
      </View>

      {/* Status */}
      <View style={styles.statusSection}>
        <Text style={styles.sectionTitle}>Holati</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
          <MaterialIcons name={statusInfo.icon} size={20} color="#fff" />
          <Text style={styles.statusText}>{statusInfo.text}</Text>
        </View>
      </View>

      {/* Cart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buyurtma</Text>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.cartRow}>
            <Text>{item.quantity} × {item.itemName}</Text>
            {order.status === 'new' && (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => handleQuantityChange(item.itemName, -1)}>
                  <MaterialIcons name="remove-circle-outline" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleQuantityChange(item.itemName, 1)}>
                  <MaterialIcons name="add-circle-outline" size={24} color="green" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
        <Text style={styles.total}>Jami: {order.totalPrice.toLocaleString('uz-UZ')} UZS</Text>
      </View>

      {/* Menu Search & Browse */}
      {order.status === 'new' && (
        <>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Qidirish..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList
            data={filteredMenu}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.menuItem} onPress={() => handleAddToOrder(item)}>
                <Text>{item.name} - {item.price.toLocaleString('uz-UZ')} UZS</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      {/* Send to kitchen */}
      {order.status === 'new' && (
        <TouchableOpacity style={styles.sendBtn} onPress={handleSendToKitchen}>
          <Text style={styles.sendBtnText}>Oshxonaga Yuborish</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#343a40' },
  tableText: { fontSize: 18, color: '#6c757d', marginTop: 4 },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    padding: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  statusSection: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 8,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statusBadge: { flexDirection: 'row', alignItems: 'center', padding: 8, borderRadius: 20 },
  statusText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 },
  cartRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  total: { fontWeight: 'bold', marginTop: 10, fontSize: 16 },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: { flex: 1, padding: 8 },
  menuItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  sendBtn: {
    backgroundColor: '#28a745',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default OrderScreen;
