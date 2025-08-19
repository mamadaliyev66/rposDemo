import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, writeBatch, doc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import MenuItemCard from '../Shared/MenuItemCard';
import OrderItem from '../Shared/OrderItem';
import CustomButton from '../Shared/CustomButton';
import { MaterialIcons } from '@expo/vector-icons';

const MenuScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  const { tableId, tableNumber } = route.params;

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftOrder, setDraftOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const q = query(collection(db, 'menuItems'), where('isAvailable', '==', true));
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMenuItems(items);

        const uniqueCategories = ['All', ...new Set(items.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching menu:", error);
        Alert.alert("Error", "Could not load menu.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const draftTotal = useMemo(() => {
    return draftOrder.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [draftOrder]);

  const handleAddItem = (itemToAdd) => {
    setDraftOrder(prevOrder => {
      const existingItemIndex = prevOrder.findIndex(item => item.itemId === itemToAdd.id);
      if (existingItemIndex > -1) {
        const updatedOrder = [...prevOrder];
        updatedOrder[existingItemIndex].quantity += 1;
        return updatedOrder;
      } else {
        const newItem = {
          itemId: itemToAdd.id,
          itemName: itemToAdd.name,
          price: itemToAdd.price,
          quantity: 1,
        };
        return [...prevOrder, newItem];
      }
    });
  };

  const handleUpdateQuantity = (itemIndex, newQuantity) => {
    const updatedOrder = [...draftOrder];
    updatedOrder[itemIndex].quantity = newQuantity;
    setDraftOrder(updatedOrder);
  };

  const handleRemoveItem = (itemIndex) => {
    Alert.alert(
      "Remove Item",
      "Are you sure you want to remove this item from the order?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => {
            const updatedOrder = [...draftOrder];
            updatedOrder.splice(itemIndex, 1);
            setDraftOrder(updatedOrder);
          }
        }
      ]
    );
  };

  const handlePlaceOrder = async () => {
    if (draftOrder.length === 0) {
      Alert.alert("Empty Order", "Please add at least one item.");
      return;
    }
    setIsPlacingOrder(true);

    const batch = writeBatch(db);
    const newOrderRef = doc(collection(db, 'orders'));
    batch.set(newOrderRef, {
      tableId,
      tableNumber,
      waiterId: user.uid,
      items: draftOrder,
      totalPrice: draftTotal,
      status: 'new',
      createdAt: Timestamp.fromDate(new Date()),
      completedAt: null,
    });

    const tableRef = doc(db, 'tables', tableId);
    batch.update(tableRef, {
      status: 'occupied',
      currentOrderId: newOrderRef.id,
    });

    try {
      await batch.commit();
      Alert.alert("Success", "Order sent to kitchen.", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error("Error placing order: ", error);
      Alert.alert("Error", "Could not send order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007bff" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Table #{tableNumber} - Menu</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search menu..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map(cat => (
          <TouchableOpacity 
            key={cat} 
            style={[styles.categoryButton, selectedCategory === cat && styles.categoryButtonSelected]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextSelected]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredMenuItems}
        renderItem={({ item }) => <MenuItemCard item={item} onPress={() => handleAddItem(item)} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 200 }}
      />

      <View style={styles.draftOrderContainer}>
        <Text style={styles.draftHeader}>Current Order</Text>
        {draftOrder.length > 0 ? (
          <>
            <FlatList
              data={draftOrder}
              renderItem={({ item, index }) => (
                <OrderItem 
                  item={item} 
                  mode="interactive"
                  onQuantityChange={(newQty) => handleUpdateQuantity(index, newQty)}
                  onRemove={() => handleRemoveItem(index)}
                />
              )}
              keyExtractor={(item, index) => `${item.itemId}-${index}`}
              style={{ maxHeight: 150 }}
            />
            <View style={styles.draftTotalContainer}>
              <Text style={styles.draftTotalText}>Total:</Text>
              <Text style={styles.draftTotalAmount}>{draftTotal.toLocaleString()} UZS</Text>
            </View>
            <CustomButton
              title="Send to Kitchen"
              onPress={handlePlaceOrder}
              loading={isPlacingOrder}
              disabled={isPlacingOrder || draftOrder.length === 0}
              color="success"
              style={{ marginTop: 10 }}
            />
          </>
        ) : (
          <View style={styles.emptyCartContainer}>
            <MaterialIcons name="shopping-cart" size={40} color="#ced4da"/>
            <Text style={styles.emptyCartText}>Cart is empty</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 15, color: '#343a40' },
  searchBar: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1
  },
  categoryContainer: { flexDirection: 'row', paddingHorizontal: 10, paddingBottom: 10 },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#e9ecef', marginRight: 10 },
  categoryButtonSelected: { backgroundColor: '#007bff' },
  categoryText: { fontSize: 14, fontWeight: '600', color: '#495057' },
  categoryTextSelected: { color: '#fff' },
  draftOrderContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    elevation: 10
  },
  draftHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  emptyCartContainer: { alignItems: 'center', paddingVertical: 20 },
  emptyCartText: { marginTop: 10, fontSize: 16, color: '#6c757d' },
  draftTotalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderColor: '#e9ecef'},
  draftTotalText: { fontSize: 18, fontWeight: '600'},
  draftTotalAmount: { fontSize: 18, fontWeight: 'bold', color: '#28a745' }
});

export default MenuScreen;
