import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * A reusable card component to display the status of a single restaurant table.
 *
 * @param {object} props - The properties for the component.
 * @param {object} props.table - The table object (must contain tableNumber and status).
 * @param {function} props.onPress - The function to execute when the card is pressed.
 * @param {object} [props.style] - Custom styles to apply to the card container.
 */
const TableCard = ({ table, onPress, style }) => {
  // Define styles based on the table's status
  const getStatusInfo = (status) => {
    switch (status) {
      case 'available':
        return {
          text: "Bo'sh", // "Available" in Uzbek
          icon: 'check-circle-outline',
          color: '#28a745',
          backgroundColor: '#e9f7ef',
        };
      case 'occupied':
        return {
          text: 'Band', // "Occupied" in Uzbek
          icon: 'account-multiple',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
        };
      case 'reserved':
        return {
          text: 'Zaxira', // "Reserved" in Uzbek
          icon: 'clock-time-three-outline',
          color: '#007bff',
          backgroundColor: '#dbeaff',
        };
      default:
        return {
          text: 'Noma\'lum', // "Unknown" in Uzbek
          icon: 'help-circle-outline',
          color: '#6c757d',
          backgroundColor: '#e9ecef',
        };
    }
  };

  const statusInfo = getStatusInfo(table.status);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: statusInfo.backgroundColor, borderColor: statusInfo.color },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.mainContent}>
        <MaterialCommunityIcons name="table-furniture" size={50} color={statusInfo.color} />
        <Text style={[styles.tableNumber, { color: statusInfo.color }]}>
          {table.tableNumber}
        </Text>
      </View>
      <View style={[styles.statusContainer, { backgroundColor: statusInfo.color }]}>
        <MaterialCommunityIcons name={statusInfo.icon} size={16} color="#fff" />
        <Text style={styles.statusText}>{statusInfo.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    aspectRatio: 1, // Make it a square
    margin: 8,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden', // Ensures the footer corners are rounded correctly
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableNumber: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
});

export default TableCard;