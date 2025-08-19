import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

/**
 * A reusable custom button component.
 *
 * @param {object} props - The properties for the component.
 * @param {function} props.onPress - The function to execute when the button is pressed.
 * @param {string} props.title - The text to display on the button.
 * @param {('primary'|'success'|'danger'|'secondary')} [props.color='primary'] - The color theme of the button.
 * @param {boolean} [props.disabled=false] - If true, the button is non-interactive.
 * @param {boolean} [props.loading=false] - If true, shows a loading indicator instead of text.
 * @param {object} [props.style] - Custom styles to override the button container style.
 * @param {object} [props.textStyle] - Custom styles to override the text style.
 * @param {React.ReactNode} [props.icon] - An optional icon component to display to the left of the title.
 */
const CustomButton = ({
  onPress,
  title,
  color = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const isButtonDisabled = disabled || loading;

  const buttonColorStyle = {
    primary: styles.primary,
    success: styles.success,
    danger: styles.danger,
    secondary: styles.secondary,
  }[color];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonColorStyle,
        isButtonDisabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={isButtonDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    minHeight: 50, // Ensure consistent height
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  // Color Variants
  primary: {
    backgroundColor: '#007bff',
  },
  success: {
    backgroundColor: '#28a745',
  },
  danger: {
    backgroundColor: '#dc3545',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  // State Variant
  disabled: {
    backgroundColor: '#ced4da',
    elevation: 0,
  },
});

export default CustomButton;