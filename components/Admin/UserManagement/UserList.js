import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from '../../../firebase/config';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  doc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';

const UserListScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Remove auth constant since we're not using it for deletion

  useEffect(() => {
    // Set up a real-time listener to fetch users
    const q = query(collection(db, 'users'), orderBy('displayName', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedUsers = [];
      querySnapshot.forEach((doc) => {
        // The document ID is the user's UID
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

  // Function to handle user deletion with proper error handling
  const deleteUserCompletely = async (userToDelete) => {
    try {
      // Delete from Firestore first
      await deleteDoc(doc(db, 'users', userToDelete.id));
      console.log('User deleted from Firestore successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user from Firestore:', error);
      throw error;
    }
  };

  const handleDelete = (user) => {
    console.log('Preparing to delete user:', user);
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      console.log('Starting deletion process for user ID:', userToDelete.id);
      
      // Delete from Firestore
      await deleteUserCompletely(userToDelete);
      
      // Close modal and reset state
      setDeleteModalVisible(false);
      setUserToDelete(null);
      
      // Show success alert
      Alert.alert(
        "User Removed",
        `${userToDelete.displayName} has been removed from the app.\n\nIMPORTANT: To completely disable their login access, please:\n1. Go to Firebase Console\n2. Navigate to Authentication > Users\n3. Find and delete ${userToDelete.email}\n\nThis prevents them from logging in again.`
      );
      
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert(
        "Delete Failed", 
        `Could not delete ${userToDelete.displayName}. Error: ${error.message}\n\nPlease check your permissions and try again.`
      );
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setUserToDelete(null);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditDisplayName(user.displayName);
    setEditRole(user.role);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!editDisplayName.trim()) {
      Alert.alert("Error", "Display name cannot be empty.");
      return;
    }

    try {
      await updateDoc(doc(db, 'users', selectedUser.id), {
        displayName: editDisplayName.trim(),
        role: editRole
      });

      Alert.alert("Success", "User updated successfully!");
      setEditModalVisible(false);
      setSelectedUser(null);
      setEditDisplayName('');
      setEditRole('');
    } catch (error) {
      console.error("Error updating user: ", error);
      Alert.alert("Error", "Failed to update user. Please try again.");
    }
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin':
        return { backgroundColor: '#dc3545', color: '#fff' };
      case 'cashier':
        return { backgroundColor: '#ffc107', color: '#212529' };
      case 'waiter':
        return { backgroundColor: '#007bff', color: '#fff' };
      default:
        return { backgroundColor: '#6c757d', color: '#fff' };
    }
  };

  const renderUserItem = ({ item }) => {
    const roleStyle = getRoleStyle(item.role);
    return (
      <View style={styles.userCard}>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.displayName}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
        </View>
        <View style={styles.actionsContainer}>
          <View style={[styles.roleBadge, { backgroundColor: roleStyle.backgroundColor }]}>
            <Text style={[styles.roleText, { color: roleStyle.color }]}>{item.role}</Text>
          </View>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
            <MaterialIcons name="edit" size={24} color="#007bff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
            <MaterialIcons name="delete-forever" size={28} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={<Text style={styles.header}>User Management</Text>}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No users found.</Text>
          </View>
        }
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddUser')}
      >
        <MaterialIcons name="person-add" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit User</Text>
            
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={editDisplayName}
              onChangeText={setEditDisplayName}
              placeholder="Enter display name"
            />

            <Text style={styles.label}>Role</Text>
            <View style={styles.roleSelector}>
              {['admin', 'cashier', 'waiter'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.roleOption,
                    editRole === role && styles.selectedRole
                  ]}
                  onPress={() => setEditRole(role)}
                >
                  <Text style={[
                    styles.roleOptionText,
                    editRole === role && styles.selectedRoleText
                  ]}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="warning" size={48} color="#dc3545" style={styles.warningIcon} />
            <Text style={styles.modalTitle}>Confirm Deletion</Text>
            
            {userToDelete && (
              <View style={styles.deleteUserInfo}>
                <Text style={styles.deleteUserName}>{userToDelete.displayName}</Text>
                <Text style={styles.deleteUserEmail}>{userToDelete.email}</Text>
                <View style={[styles.deleteUserRole, getRoleStyle(userToDelete.role)]}>
                  <Text style={[styles.roleText, { color: getRoleStyle(userToDelete.role).color }]}>
                    {userToDelete.role}
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.deleteWarningText}>
              Are you sure you want to delete this user? This action cannot be undone.
            </Text>

            <Text style={styles.deleteNoteText}>
              Note: This will remove the user from your app's database. To fully disable their login, 
              you'll need to manually remove them from Firebase Authentication in the Firebase Console.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 10,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 100, // Space for FAB
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  editButton: {
    padding: 5,
    marginRight: 5,
  },
  deleteButton: {
    padding: 5,
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
    backgroundColor: '#007bff',
    borderRadius: 30,
    elevation: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleOption: {
    flex: 1,
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  roleOptionText: {
    fontSize: 14,
    color: '#6c757d',
  },
  selectedRoleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Delete modal specific styles
  warningIcon: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  deleteUserInfo: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  deleteUserName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 5,
  },
  deleteUserEmail: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 10,
  },
  deleteUserRole: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  deleteWarningText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  deleteNoteText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteConfirmButton: {
    backgroundColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UserListScreen;