import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkEvento = async () => {
      try {
        const evento = await AsyncStorage.getItem('eventoSeleccionado');

        setTimeout(() => {
          if (evento) {
            navigation.replace('MainTabs'); // ✅ Va al Home si ya hay evento
          } else {
            navigation.replace('Main');     // ✅ Va a seleccionar evento
          }
        }, 2500);
      } catch (error) {
        console.error('Error al verificar evento:', error);
        navigation.replace('Main');
      }
    };

    checkEvento();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/banner.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Animación en pantalla completa */}
      <LottieView
        source={require('../../assets/animations/splashscreen.json')}
        autoPlay
        loop={false}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SplashScreen;
