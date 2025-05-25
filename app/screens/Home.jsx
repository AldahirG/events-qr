import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useThemeColors } from '../../theme/colors';

const Home = () => {
  const [evento, setEvento] = useState('');
  const colors = useThemeColors();

  useEffect(() => {
    const cargarEvento = async () => {
      const valor = await AsyncStorage.getItem('eventoSeleccionado');
      if (valor) setEvento(valor);
    };

    cargarEvento();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LottieView
        source={require('../../assets/animations/hi.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />

      <Text style={[styles.title, { color: colors.text }]}>Evento seleccionado:</Text>
      <Text style={[styles.eventName, { color: colors.primary }]}>"{evento}"</Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  lottie: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventName: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default Home;
