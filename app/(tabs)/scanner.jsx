import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Camera from 'expo-camera';
import Toast from 'react-native-toast-message';
import * as Haptics from 'expo-haptics';

import { BASE_URL } from '../../utils/config';
import { getEventoSeleccionado } from '../../utils/storage';
import { useThemeColors } from '../../theme/colors';

export default function Scanner() {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  const colors = useThemeColors();

  useEffect(() => {
    requestPermission();
  }, []);

  const resetScanner = () => {
    setTimeout(() => setScanned(false), 3000);
  };

  const handleScan = async ({ data }) => {
    const id = String(data).trim();

    setScanned(true);
    setLoading(true);

    try {
      const conferencista = await getEventoSeleccionado();
      if (!conferencista) throw new Error("No hay evento seleccionado");

      const getResponse = await fetch(
        `${BASE_URL}/registros/get/${id}?conferencista=${encodeURIComponent(conferencista)}`
      );

      if (!getResponse.ok) {
        if (getResponse.status === 404) throw new Error("Registro no encontrado");
        throw new Error("Error al obtener el registro");
      }

      const record = await getResponse.json();

      if (record.asistio === "SI") {
        Toast.show({
          type: "info",
          text1: "Ya registrado",
          text2: `${record.nombre || "Usuario"} ya tiene asistencia marcada`,
        });
        resetScanner();
        return;
      }

      const updateResponse = await fetch(
        `${BASE_URL}/registros/${id}?conferencista=${encodeURIComponent(conferencista)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ asistio: "SI" }),
        }
      );

      if (!updateResponse.ok) throw new Error("Error al actualizar");

      Toast.show({
        type: "success",
        text1: "Asistencia registrada",
        text2: `${record.nombre || "Usuario"} actualizado correctamente`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message || "Error desconocido",
      });
    } finally {
      setLoading(false);
      resetScanner();
    }
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <Text style={styles.webMessage}>El escáner QR no está disponible en versión web.</Text>
      </View>
    );
  }

  if (!permission) return <Text>Solicitando permisos...</Text>;
  if (!permission.granted) return <Text>Permiso denegado para la cámara.</Text>;

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
          <>
            <View style={styles.scannerWrapper}>
              <Camera.CameraView
                ref={cameraRef}
                style={StyleSheet.absoluteFillObject}
                onBarcodeScanned={scanned ? undefined : handleScan}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              />
            </View>

            <Text style={[styles.instruction, { color: colors.text }]}>
              Coloca el código dentro del recuadro
            </Text>

            {scanned && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => setScanned(false)}
              >
                <Text style={styles.buttonText}>Escanear de nuevo</Text>
              </TouchableOpacity>
            )}
          </>
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
  scannerWrapper: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
    maxWidth: 300,
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
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  webContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webMessage: {
    fontSize: 18,
    textAlign: 'center',
    padding: 20,
  },
});