import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

// A placeholder image in case the item has no image URL
const placeholderImage = require('../../assets/icon.png'); 

/**
 * A reusable card component to display a single menu item.
 *
 * @param {object} props - The properties for the component.
 * @param {object} props.item - The menu item object (should contain name, price, imageUrl, isAvailable).
 * @param {function} props.onPress - The function to execute when the card is pressed.
 * @param {object} [props.style] - Custom styles to apply to the card container.
 */
const MenuItemCard = ({ item, onPress, style }) => {
  const isAvailable = item.isAvailable !== false; // Default to true if undefined

  return (
    <TouchableOpacity
      style={[styles.card, !isAvailable && styles.unavailableCard, style]}
      onPress={isAvailable ? onPress : null} // Only allow press if available
      activeOpacity={isAvailable ? 0.7 : 1.0}
    >
      <Image
        source={item.imageUrl ? { uri: item.imageUrl } : placeholderImage}
        style={styles.image}
      />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.nameText} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.priceText}>
          {item.price ? `${item.price.toLocaleString('uz-UZ')} UZS` : 'N/A'}
        </Text>
      </View>

      {!isAvailable && (
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Mavjud Emas</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden', // Ensures the overlay corners are rounded
    flex: 1, // Important for FlatList with numColumns
    maxWidth: '46%', // For a 2-column layout with margins
  },
  unavailableCard: {
    // No specific style change here, the overlay handles the visual cue
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#f0f0f0', // Placeholder color while image loads
  },
  detailsContainer: {
    padding: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    minHeight: 40, // Ensure consistent height for 1 or 2 lines of text
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007bff',
    marginTop: 4,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // This makes the view cover the entire parent
    backgroundColor: 'rgba(108, 117, 125, 0.7)', // A semi-transparent grey
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    transform: [{ rotate: '-15deg' }], // Adds a bit of style
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default MenuItemCard;