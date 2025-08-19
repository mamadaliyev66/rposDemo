import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * A reusable component to display a single item within an order.
 *
 * @param {object} props - The properties for the component.
 * @param {object} props.item - The item object from an order (must contain itemName, quantity, price).
 * @param {'display' | 'interactive'} [props.mode='display'] - Controls the component's appearance and functionality.
 * @param {function} [props.onQuantityChange] - Function called with the new quantity in interactive mode.
 * @param {function} [props.onRemove] - Function called when the remove button is pressed in interactive mode.
 * @param {object} [props.style] - Custom styles for the container.
 */
const OrderItem = ({
  item,
  mode = 'display',
  onQuantityChange,
  onRemove,
  style,
}) => {
  const handleQuantityIncrease = () => {
    if (onQuantityChange) {
      onQuantityChange(item.quantity + 1);
    }
  };

  const handleQuantityDecrease = () => {
    if (onQuantityChange && item.quantity > 1) {
      onQuantityChange(item.quantity - 1);
    } else if (onRemove && item.quantity === 1) {
        // If quantity is 1 and user presses minus, remove the item
        onRemove();
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.detailsContainer}>
        <Text style={styles.nameText}>{item.itemName}</Text>
        <Text style={styles.priceBreakdownText}>
          {item.quantity} x {item.price.toLocaleString('uz-UZ')} UZS
        </Text>
      </View>

      {mode === 'interactive' ? (
        <View style={styles.interactiveContainer}>
          <TouchableOpacity style={styles.controlButton} onPress={handleQuantityDecrease}>
            <MaterialIcons name={item.quantity > 1 ? "remove" : "delete"} size={22} color="#dc3545" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.controlButton} onPress={handleQuantityIncrease}>
            <MaterialIcons name="add" size={22} color="#007bff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>
            {(item.quantity * item.price).toLocaleString('uz-UZ')} UZS
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
  },
  priceBreakdownText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  // Interactive Mode Styles
  interactiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
  },
  controlButton: {
    padding: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
    color: '#212529',
  },
  // Display Mode Styles
  totalPriceContainer: {
    paddingHorizontal: 10,
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
});

export default OrderItem;