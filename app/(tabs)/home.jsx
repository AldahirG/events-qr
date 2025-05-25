import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { useThemeColors } from '../../theme/colors';
import { useFocusEffect } from '@react-navigation/native';

const home = () => {
  const [evento, setEvento] = useState('');
  const [mostrarTexto, setMostrarTexto] = useState(false);
  const colors = useThemeColors();

  useFocusEffect(
    useCallback(() => {
      const cargarEvento = async () => {
        const valor = await AsyncStorage.getItem('eventoSeleccionado');
        if (valor) setEvento(valor);
      };

      cargarEvento();
    }, [])
  );

  useEffect(() => {
    const timeout = setTimeout(() => setMostrarTexto(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LottieView
        source={require('../../assets/animations/hi.json')}
        autoPlay
        loop={false}
        speed={1.2}
        style={styles.lottie}
      />

      {mostrarTexto && (
        <>
          <Text style={[styles.title, { color: colors.text }]}>Evento seleccionado:</Text>
          <Text style={[styles.eventName, { color: colors.primary }]}>{`"${evento}"`}</Text>
        </>
      )}
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
    width: width * 0.6,
    height: width * 0.6,
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

export default home;
