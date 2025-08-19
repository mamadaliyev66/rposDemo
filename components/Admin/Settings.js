import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Application from 'expo-application';
import { AuthContext } from '../../context/AuthContext';

const SettingsScreen = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (screenName) => {
    Alert.alert(
      "Feature Not Implemented",
      `Navigation to "${screenName}" is not yet set up.`
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.displayName?.charAt(0) || "?"}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.displayName || "Guest"}</Text>
        <Text style={styles.profileEmail}>{user?.email || "No email"}</Text>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.row}
          onPress={() => handleNavigate('RestaurantProfile')}
        >
          <MaterialIcons name="store" size={24} color="#495057" />
          <Text style={styles.rowTitle}>Restaurant Profile</Text>
          <MaterialIcons name="chevron-right" size={24} color="#adb5bd" />
        </TouchableOpacity>
      </View>

      {/* General Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.row}
          onPress={() => handleNavigate('Appearance')}
        >
          <MaterialIcons name="palette" size={24} color="#495057" />
          <Text style={styles.rowTitle}>Appearance</Text>
          <MaterialIcons name="chevron-right" size={24} color="#adb5bd" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.row}
          onPress={() => handleNavigate('Language')}
        >
          <MaterialIcons name="language" size={24} color="#495057" />
          <Text style={styles.rowTitle}>Language</Text>
          <MaterialIcons name="chevron-right" size={24} color="#adb5bd" />
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={[styles.row, styles.noPress]}>
          <MaterialIcons name="info-outline" size={24} color="#495057" />
          <Text style={styles.rowTitle}>App Version</Text>
          <Text style={styles.rowValue}>
            {Application.nativeApplicationVersion} ({Application.nativeBuildVersion})
          </Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
  },
  profileEmail: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 2,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  noPress: {
    shadowOpacity: 0, // No shadow for static rows
    elevation: 0,
  },
  rowTitle: {
    flex: 1,
    fontSize: 18,
    color: '#212529',
    marginLeft: 15,
  },
  rowValue: {
    fontSize: 16,
    color: '#6c757d',
  },
  logoutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  logoutButtonText: {
    color: '#dc3545',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SettingsScreen;
