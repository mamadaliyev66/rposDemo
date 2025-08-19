import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * A reusable component to display a formatted error message.
 *
 * @param {object} props - The properties for the component.
 * @param {string} props.message - The error message to display.
 * @param {function} [props.onRetry] - An optional function to call when the retry button is pressed. The button will not be shown if this is not provided.
 * @param {object} [props.style] - Custom styles to apply to the container.
 */
const Error = ({ message, onRetry, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <MaterialIcons name="error-outline" size={48} color="#dc3545" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Xatolik yuz berdi</Text>
          <Text style={styles.message}>{message || "Noma'lum xatolik."}</Text>
        </View>
      </View>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Qayta urinish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
    padding: 15,
    margin: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#721c24',
  },
  message: {
    fontSize: 14,
    color: '#721c24',
    marginTop: 4,
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-end', // Aligns button to the right
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Error;