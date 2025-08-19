import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Animatable.View
        animation="fadeIn"
        duration={1500} // Animation duration in milliseconds
      >
        <Image
          source={require('../assets/icon.png')} // Your app's main icon
          style={styles.logo}
        />
      </Animatable.View>

      <Animatable.Text
        style={styles.title}
        animation="fadeInUp"
        duration={1000}
        delay={500} // Start this animation after the logo fades in
      >
        RPOS
      </Animatable.Text>

      <ActivityIndicator 
        size="large" 
        color="#ffffff" 
        style={styles.indicator} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#343a40', // A dark, professional background
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius:30
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2, // Adds some space between letters for a stylistic effect
  },
  indicator: {
    marginTop: 30,
  },
});

export default SplashScreen;