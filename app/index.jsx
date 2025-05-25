import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkEvento = async () => {
      try {
        const evento = await AsyncStorage.getItem('eventoSeleccionado');
        console.log('🔎 Evento encontrado:', evento);

        setTimeout(() => {
          if (evento) {
            router.replace('/(tabs)/home');
          } else {
            router.replace('/main');
          }
        }, 2500); // duración de splash animación
      } catch (error) {
        console.error('❌ Error leyendo evento:', error);
        router.replace('/main');
      }
    };

    checkEvento();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/banner.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <LottieView
        source={require('../assets/animations/splashscreen.json')}
        autoPlay
        loop={false}
        style={StyleSheet.absoluteFillObject}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
});
