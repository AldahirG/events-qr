import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { BASE_URL } from '../../utils/config';
import { getEventoSeleccionado } from '../../utils/storage';
import { useThemeColors } from '../../theme/colors';
import { opcionesInvito } from '../../constants/opcionesInvito';

export default function ShowInfo() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colors = useThemeColors();

  const [loading, setLoading] = useState(true);
  const [errores, setErrores] = useState({});
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nivelEstudios, setNivelEstudios] = useState('');
  const [nombreInvito, setNombreInvito] = useState('');
  const [escProc, setEscProc] = useState('');
  const [programaInteres, setProgramaInteres] = useState('');
  const [asistio, setAsistio] = useState('NO');

  useEffect(() => {
    const cargarRegistro = async () => {
      try {
        const conferencista = await getEventoSeleccionado();
        if (!conferencista) throw new Error('No hay evento seleccionado');

        const res = await fetch(`${BASE_URL}/registros/${id}?conferencista=${encodeURIComponent(conferencista)}`);
        if (!res.ok) throw new Error('Error al obtener registro');
        const data = await res.json();

        setNombre(data.nombre || '');
        setCorreo(data.correo || '');
        setTelefono(data.telefono || '');
        setNivelEstudios(data.Nivel_Estudios || '');
        setNombreInvito(data.Nombre_invito || '');
        setEscProc(data.escProc || '');
        setProgramaInteres(data.programaInteres || '');
        setAsistio(data.asistio || 'NO');
      } catch (e) {
        Toast.show({ type: 'error', text1: 'Error', text2: e.message });
      } finally {
        setLoading(false);
      }
    };

    if (id) cargarRegistro();
  }, [id]);

  const confirmAttendance = async () => {
    setLoading(true);
    setErrores({});

    try {
      const conferencista = await getEventoSeleccionado();
      if (!conferencista) throw new Error("No hay evento seleccionado");

      const newErrors = {};
      if (!nombre.trim()) newErrors.nombre = true;
      if (!telefono.trim()) newErrors.telefono = true;

      if (correo.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo.trim())) {
          newErrors.correo = true;
          Toast.show({ type: "error", text1: "Correo inválido", text2: "Introduce un correo válido." });
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrores(newErrors);
        Toast.show({ type: "error", text1: "Faltan campos obligatorios", text2: "Nombre y teléfono son requeridos." });
        return;
      }

      const res = await fetch(`${BASE_URL}/registros/${id}?conferencista=${encodeURIComponent(conferencista)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          correo,
          telefono,
          Nivel_Estudios: nivelEstudios,
          Nombre_invito: nombreInvito,
          escProc: escProc.toUpperCase(),
          programaInteres,
          asistio
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar el registro");

      Toast.show({ type: 'success', text1: 'Actualización exitosa', text2: 'Registro actualizado correctamente.' });
      setTimeout(() => router.push('/(tabs)/list'), 2000);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  const InfoBox = ({ label, value, onChangeText, editable = true, error = false }) => (
    <View style={styles.infoBox}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: error ? colors.error : colors.border,
            backgroundColor: colors.card,
            color: colors.text,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        blurOnSubmit={false}
        multiline={false}
      />
    </View>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <ImageBackground source={require('../../assets/images/banner.jpg')} style={styles.background}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.header, { color: colors.primary }]}>Información de Registro</Text>

          <InfoBox label="Nombre" value={nombre} editable={false} />
          <InfoBox label="Correo" value={correo} onChangeText={setCorreo} error={errores.correo} />
          <InfoBox label="Teléfono" value={telefono} onChangeText={setTelefono} error={errores.telefono} />
          <InfoBox label="Nivel de Estudios" value={nivelEstudios} editable={false} />
          <InfoBox label="Escuela de Procedencia" value={escProc} onChangeText={(v) => setEscProc(v.toUpperCase())} />
          <InfoBox label="Programa de Interés" value={programaInteres} onChangeText={setProgramaInteres} />

          <Text style={[styles.label, { color: colors.text }]}>¿Quién te invitó?</Text>
          <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Picker selectedValue={nombreInvito} onValueChange={setNombreInvito} style={{ color: colors.text }}>
              {opcionesInvito.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>¿Asistió?</Text>
          <View style={[styles.pickerContainer, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Picker selectedValue={asistio} onValueChange={setAsistio} style={{ color: colors.text }}>
              <Picker.Item label="SI" value="SI" />
              <Picker.Item label="NO" value="NO" />
            </Picker>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: loading ? colors.disabled : colors.primary }]}
            onPress={confirmAttendance}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon name="check" size={18} color="#fff" style={{ marginRight: 5 }} />
                <Text style={styles.buttonText}>Confirmar asistencia</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: colors.error }]}
            onPress={() => router.push('/(tabs)/list')}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoBox: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  pickerContainer: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
