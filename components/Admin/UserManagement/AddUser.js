import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';

const AddUserScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('waiter'); // Default role
  const [loading, setLoading] = useState(false);

  // A simple email validation regex
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddUser = async () => {
    // --- Form Validation ---
    if (!displayName || !email || !password) {
      Alert.alert('Incomplete Form', 'Please fill all fields.');
      return;
    }
    if (!isEmailValid(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    // Store the current user (admin) before creating new user
    const currentUser = auth.currentUser;
    
    try {
      console.log('Starting user creation process...');
      console.log('Email:', email);
      console.log('Display Name:', displayName);
      console.log('Role:', role);

      // 1. Create user in Firebase Authentication
      console.log('Creating user in Firebase Authentication...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      console.log('User created in Auth with UID:', newUser.uid);

      // 2. Save user details and role in Firestore
      console.log('Saving user data to Firestore...');
      await setDoc(doc(db, 'users', newUser.uid), {
        uid: newUser.uid,
        displayName: displayName.trim(),
        email: email.toLowerCase().trim(),
        role: role,
        createdAt: Timestamp.fromDate(new Date()),
        isActive: true, // Add active status
      });
      console.log('User data saved to Firestore successfully');

      // 3. IMPORTANT: Sign out the newly created user and sign back in the admin
      // This prevents the newly created user from being automatically logged in
      if (newUser) {
        await signOut(auth);
        console.log('New user signed out');
        
        // If you need to sign the admin back in, you would do it here
        // But typically the app should handle the sign-in state automatically
      }

      setLoading(false);
      
      // Clear form
      setEmail('');
      setPassword('');
      setDisplayName('');
      setRole('waiter');

      Alert.alert(
        'Success',
        `User "${displayName}" has been created successfully!\n\nEmail: ${email}\nRole: ${role}\n\nThey can now log in with their credentials.`,
        [{ 
          text: 'OK', 
          onPress: () => {
            console.log('User creation completed successfully');
            navigation.goBack();
          }
        }]
      );

    } catch (error) {
      setLoading(false);
      console.error("Error creating user:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      // Provide user-friendly error messages
      let errorMessage = 'An error occurred while creating the user. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already registered. Please use a different email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid. Please enter a correct email.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak. Please choose a stronger password.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection and try again.';
          break;
        default:
          errorMessage = `Error: ${error.message}`;
      }
      
      Alert.alert('Creation Failed', errorMessage);
    }
  };

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setRole('waiter');
  };
  
  if (loading) {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>Creating User...</Text>
            <Text style={styles.loadingSubText}>Adding to Authentication & Database</Text>
        </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add New User</Text>
      
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>User Information</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Full Name (e.g., Anvar Anvarov)"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password (min. 6 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.roleHeader}>Assign Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'waiter' && styles.roleButtonSelected]}
            onPress={() => setRole('waiter')}
          >
            <Text style={[styles.roleButtonText, role === 'waiter' && styles.roleButtonTextSelected]}>
              Waiter
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'cashier' && styles.roleButtonSelected]}
            onPress={() => setRole('cashier')}
          >
            <Text style={[styles.roleButtonText, role === 'cashier' && styles.roleButtonTextSelected]}>
              Cashier
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'admin' && styles.roleButtonSelected]}
            onPress={() => setRole('admin')}
          >
            <Text style={[styles.roleButtonText, role === 'admin' && styles.roleButtonTextSelected]}>
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
            <Text style={styles.clearButtonText}>Clear Form</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
            <Text style={styles.addButtonText}>Create User</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>📋 What happens when you create a user:</Text>
        <Text style={styles.infoText}>• User account created in Firebase Authentication</Text>
        <Text style={styles.infoText}>• User profile saved in Firestore database</Text>
        <Text style={styles.infoText}>• User can immediately log in with their credentials</Text>
        <Text style={styles.infoText}>• User gets assigned the selected role permissions</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#343a40',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  roleHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginTop: 15,
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007bff',
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#007bff',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
  roleButtonTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  clearButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.4,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flex: 0.55,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
  },
  loadingSubText: {
    marginTop: 5,
    fontSize: 14,
    color: '#6c757d',
  },
  infoContainer: {
    backgroundColor: '#e7f3ff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c5460',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#0c5460',
    marginBottom: 5,
  },
});

export default AddUserScreen;