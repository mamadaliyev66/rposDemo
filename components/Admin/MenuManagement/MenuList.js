import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { db, storage } from '../../../firebase/config';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';

const MenuListScreen = () => {
  const navigation = useNavigation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'menuItems'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMenuItems(items);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching menu:', error);
        Alert.alert('Error', 'Could not fetch menu items.');
        setLoading(false);
      }
    );
    return unsubscribe;
  }, []);

const handleDelete = (item) => {
  Alert.alert(
    'Confirm Delete',
    `Do you really want to delete "${item.name}"?`,
    [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            // 1. Delete Firestore document
            await deleteDoc(doc(db, 'menuItems', item.id));

            // 2. Determine the image path
            let pathToDelete = item.imagePath;
            if (!pathToDelete && item.imageUrl) {
              try {
                // Extract path from URL
                const decoded = decodeURIComponent(item.imageUrl);
                const match = decoded.match(/\/o\/(.*?)\?/);
                if (match && match[1]) {
                  pathToDelete = match[1];
                }
              } catch (e) {
                console.error('Error extracting image path:', e);
              }
            }

            // 3. Delete from storage if we have a path
            if (pathToDelete) {
              await deleteObject(ref(storage, pathToDelete));
            }

            Alert.alert('Success', 'Item deleted successfully.');
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Error', 'Failed to delete item.');
          }
        },
      },
    ]
  );
};
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.price}>
          {item.price?.toLocaleString('uz-UZ')} UZS
        </Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => navigation.navigate('EditItem', { itemId: item.id })}>
          <MaterialIcons name="edit" size={26} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item)} style={{ marginTop: 10 }}>
          <MaterialIcons name="delete-forever" size={26} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Menu...</Text>
      </View>
    );
  }

  if (!menuItems.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No menu items found.</Text>
        <Text style={styles.emptySubText}>Tap the + button to add one!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddItem')}>
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContainer: { padding: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 3,
  },
  image: { width: 80, height: 80, borderRadius: 8 },
  details: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold' },
  category: { fontSize: 14, color: '#6c757d', marginVertical: 2 },
  price: { fontSize: 16, fontWeight: '600', color: '#28a745' },
  actions: { justifyContent: 'center', alignItems: 'center' },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    backgroundColor: '#007bff',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  emptyText: { fontSize: 18, color: '#6c757d' },
  emptySubText: { fontSize: 14, color: '#adb5bd' },
});

export default MenuListScreen;
