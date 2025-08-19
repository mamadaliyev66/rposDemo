import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../../firebase/config';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, where } from 'firebase/firestore';

const UserRolesScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up a real-time listener to fetch users, excluding admins
    // to prevent an admin from accidentally changing their own role.
    const q = query(
      collection(db, 'users'),
      where('role', '!=', 'admin'),
      orderBy('displayName', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push({ id: doc.id, ...doc.data() });
      });
      setUsers(fetchedUsers);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users: ", error);
      setLoading(false);
      Alert.alert("Error", "Could not fetch user list.");
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (userId, newRole, userName) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        role: newRole
      });
      // The UI will update automatically due to the onSnapshot listener.
      // You could add a small toast/notification here for better UX if desired.
    } catch (error) {
      console.error(`Error updating role for ${userName}:`, error);
      Alert.alert('Update Failed', `Could not change the role for ${userName}. Please try again.`);
    }
  };

  const renderUserRoleItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userDetails}>
        <Text style={styles.userName}>{item.displayName}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={item.role}
          style={styles.picker}
          onValueChange={(itemValue) => handleRoleChange(item.id, itemValue, item.displayName)}
          dropdownIconColor="#007bff"
        >
          <Picker.Item label="Waiter" value="waiter" />
          <Picker.Item label="Cashier" value="cashier" />
          {/* Add other roles here if needed, but avoid an 'admin' option
              to prevent accidental promotion from this screen. */}
        </Picker>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading Users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUserRoleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.header}>Manage User Roles</Text>}
        ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No staff members found.</Text>
            </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#343a40',
    padding: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  userEmail: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  pickerContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    marginLeft: 10,
  },
  picker: {
    width: 150,
    height: 50, // Required for Android to have a consistent height
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
});

export default UserRolesScreen;