import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';

const UserInfoScreen = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="person-off" size={48} color="#6c757d" />
        <Text style={styles.emptyText}>Foydalanuvchi ma'lumotlari mavjud emas</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: user.photoURL || 'https://via.placeholder.com/100' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.displayName || 'Nomaʼlum foydalanuvchi'}</Text>
        <Text style={styles.role}>{user.role || 'Nomaʼlum rol'}</Text>
      </View>

      <View style={styles.infoCard}>
        <InfoRow icon="email" label="Email" value={user.email} />
        <InfoRow icon="badge" label="Rol" value={user.role || 'Nomaʼlum'} />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text style={styles.logoutText}>Chiqish</Text>
      </TouchableOpacity>
    </View>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} size={20} color="#007bff" />
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 8,
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  role: {
    fontSize: 14,
    color: '#6c757d',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 4,
    color: '#212529',
  },
  infoValue: {
    fontSize: 16,
    color: '#495057',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc3545',
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
});

export default UserInfoScreen;
