import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * A reusable full-screen loading indicator component.
 *
 * @param {object} props - The properties for the component.
 * @param {string} [props.message] - An optional message to display below the spinner.
 * @param {'small' | 'large'} [props.size='large'] - The size of the activity indicator.
 * @param {object} [props.style] - Custom styles to apply to the container.
 */
const Loading = ({ message, size = 'large', style }) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color="#007bff" />
      {message && (
        <Text style={styles.messageText}>{message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // A light background color
  },
  messageText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default Loading;