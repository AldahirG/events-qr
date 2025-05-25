import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

import { BASE_URL } from '../../utils/config';
import { getEventoSeleccionado } from '../../utils/storage';
import { useThemeColors } from '../../theme/colors';
import ScannerOverlay from '../../components/ScannerOverlay';


export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const colors = useThemeColors();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    setIsLoading(true);

    try {
      const conferencista = await getEventoSeleccionado();
      if (!conferencista) throw new Error('No hay evento seleccionado');

      // Obtener registro
      const getResponse = await fetch(
        `${BASE_URL}/registros/get/${data}?conferencista=${encodeURIComponent(conferencista)}`
      );
      if (!getResponse.ok) {
        if (getResponse.status === 404) throw new Error('Registro no encontrado');
        throw new Error('Error al obtener el registro');
      }

      const record = await getResponse.json();

      // Vibración
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Actualizar
      const updateResponse = await fetch(
        `${BASE_URL}/registros/update/${data}?conferencista=${encodeURIComponent(conferencista)}`,
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
      setIsLoading(false);
      setTimeout(() => setScanned(false), 2000); // reintento automático
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso para la cámara...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No se concedió acceso a la cámara</Text>;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/banner.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={[styles.headerText, { color: colors.primary }]}>Escanear Código QR</Text>

        <View style={[styles.qrContainer, { borderColor: colors.primary }]}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <ScannerOverlay color={colors.primary} />
        </View>

        {isLoading && (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        )}

        {scanned && !isLoading && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.buttonText}>Escanear de nuevo</Text>
          </TouchableOpacity>
        )}
      </View>
      <Toast />
    </ImageBackground>
  );
  
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    width: 300,
    height: 300,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
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


