import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColors } from '../../theme/colors';
import moment from 'moment';
import { BASE_URL } from '../../utils/config';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

const settings = () => {
  const [eventoSeleccionado, setEventoSeleccionado] = useState('');
  const [todosEventos, setTodosEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [animacionVisible, setAnimacionVisible] = useState(false);
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());

  const router = useRouter();
  const colors = useThemeColors();

  useEffect(() => {
    verificarEstadoInicial();
  }, []);

  const verificarEstadoInicial = async () => {
    const evento = await AsyncStorage.getItem('eventoSeleccionado');
    const mes = await AsyncStorage.getItem('mesSeleccionado');

    setEventoSeleccionado(evento || '');
    setFechaSeleccionada(mes ? moment(mes).toDate() : new Date());

    if (mes) {
      cargarTodosLosEventos(mes);
    }
  };

  const cargarTodosLosEventos = async (mes) => {
    try {
      if (!mes) return;

      await AsyncStorage.setItem('mesSeleccionado', mes);

      const res = await fetch(`${BASE_URL}/registros/eventos/por-mes?mes=${mes}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setTodosEventos(data.map(e => e.Conferencista));
      } else {
        console.warn('⚠️ Respuesta inválida', data);
      }
    } catch (error) {
      console.error('❌ Error cargando eventos:', error.message);
    }
  };

  const onChangeFecha = (event, selectedDate) => {
    setMostrarDatePicker(false);
    if (event.type === 'dismissed') return;

    const selected = selectedDate || fechaSeleccionada;
    setFechaSeleccionada(selected);

    const mesFormateado = moment(selected).format('YYYY-MM');
    cargarTodosLosEventos(mesFormateado);
  };

  const actualizarEvento = async () => {
    if (!eventoSeleccionado) return;

    setLoading(true);
    await AsyncStorage.setItem('eventoSeleccionado', eventoSeleccionado);
    setAnimacionVisible(true);

    setTimeout(() => {
      setAnimacionVisible(false);
      setLoading(false);
      setLoading(false); // 🔁 habilita el botón nuevamente
      router.replace('/(tabs)/home');
    }, 2200);
  };

  return (
    <ImageBackground source={require('../../assets/images/banner.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: colors.primary }]}>Configuración</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setMostrarDatePicker(true)}
        >
          <Text style={styles.buttonText}>Seleccionar mes</Text>
        </TouchableOpacity>

        {mostrarDatePicker && (
          <DateTimePicker
            value={fechaSeleccionada}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeFecha}
          />
        )}

        {todosEventos.length > 0 && (
          <>
            <Text style={[styles.label, { color: colors.text }]}>Cambiar Evento Activo:</Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.card }]}>
            <Picker
              selectedValue={eventoSeleccionado}
              onValueChange={(value) => setEventoSeleccionado(value)}
              style={{ color: colors.text }}
              dropdownIconColor={colors.text}
            >
              {todosEventos.map((evento) => (
                <Picker.Item key={evento} label={evento} value={evento} />
              ))}
            </Picker>

            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={actualizarEvento}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Actualizando...' : 'Actualizar Evento'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Modal visible={animacionVisible} transparent animationType="fade">
          <View style={styles.modalContainer}>
            <LottieView
              source={require('../../assets/animations/done.json')}
              autoPlay
              loop={false}
              style={styles.animation}
            />
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: width * 0.5,
    height: width * 0.5,
  },
});

export default settings;
