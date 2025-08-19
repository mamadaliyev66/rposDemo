import React, { useContext } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const UserInfoScreen = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Foydalanuvchi ma'lumotlari mavjud emas.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Foydalanuvchi ma'lumotlari</Text>
      <Text style={styles.text}>Ism: {user.displayName || 'Nomaʼlum'}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Text style={styles.text}>Rol: {user.role || 'Nomaʼlum'}</Text>

      <View style={{ marginTop: 20 }}>
        <Button title="Chiqish" onPress={logout} color="#dc3545" />
      </View>
    </View>
  );
};

export default UserInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
});
