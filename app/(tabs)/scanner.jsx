import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Alert,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

import { BASE_URL } from '../../utils/config';
import { getEventoSeleccionado } from '../../utils/storage';
import { useThemeColors } from '../../theme/colors';

export default function Scanner() {
  const [loading, setLoading] = useState(false);
  const colors = useThemeColors();

  const handleScan = async (e) => {
    const scannedCode = e.data;
    setLoading(true);

    try {
      const conferencista = await getEventoSeleccionado();
      if (!conferencista) throw new Error('No hay evento seleccionado');

      const getResponse = await fetch(
        `${BASE_URL}/registros/get/${scannedCode}?conferencista=${encodeURIComponent(conferencista)}`
      );
      if (!getResponse.ok) {
        if (getResponse.status === 404) throw new Error('Registro no encontrado');
        throw new Error('Error al obtener el registro');
      }

      const record = await getResponse.json();
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const updateResponse = await fetch(
        `${BASE_URL}/registros/update/${scannedCode}?conferencista=${encodeURIComponent(conferencista)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...record, asistio: 'SI' }),
        }
      );

      if (!updateResponse.ok) throw new Error('Error al actualizar el registro');

      Toast.show({
        type: 'success',
        text1: 'Asistencia registrada',
        text2: `${record.nombre || 'Usuario'} actualizado correctamente`,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/banner.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={[styles.headerText, { color: colors.primary }]}>Escanear Código QR</Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <QRCodeScanner
            onRead={handleScan}
            flashMode={RNCamera.Constants.FlashMode.auto}
            showMarker
            topContent={
              <Text style={[styles.instruction, { color: colors.text }]}>
                Coloca el código dentro del recuadro
              </Text>
            }
            bottomContent={
              <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
                <Text style={styles.buttonText}>Escanear de nuevo</Text>
              </TouchableOpacity>
            }
          />
        )}
        <Toast />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


