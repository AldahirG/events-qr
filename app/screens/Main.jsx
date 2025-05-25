import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL } from '../../utils/config';
import { setEventoSeleccionado } from '../../utils/storage';
import { useThemeColors } from '../../theme/colors';

import Loader from '../../components/Loader';
import CustomButton from '../../components/CustomButton';
import EmptyState from '../../components/EmptyState';



export default function Main({ navigation }) {

  const [date, setDate] = useState(new Date());
  const [mes, setMes] = useState(moment().format('YYYY-MM'));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [eventos, setEventos] = useState([]);
  const [conferencista, setConferencista] = useState('');
  const [loading, setLoading] = useState(true);

  const colors = useThemeColors();

  useEffect(() => {
    fetchEventos();
  }, [mes]);

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/registros/eventos/por-mes?mes=${mes}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setEventos(data);
        setConferencista(data[0].Conferencista);
      } else {
        setEventos([]);
        setConferencista('');
      }

      // Guardar mes seleccionado
      await AsyncStorage.setItem('mesSeleccionado', mes);
    } catch (error) {
      console.error('Error al cargar eventos:', error.message);
      Alert.alert('Error al cargar eventos', 'Verifica la conexión o la fecha seleccionada');
    } finally {
      setLoading(false);
    }
  };

const continuar = async () => {
  if (!conferencista) {
    Alert.alert('Debes seleccionar un evento');
    return;
  }

  await setEventoSeleccionado(conferencista);
  navigation.replace('MainTabs'); // ✅ Cambiar destino al TabNavigator
};


  const onChangeDate = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }

    const selected = selectedDate || date;
    setDate(selected);
    setMes(moment(selected).format('YYYY-MM'));
    setShowDatePicker(false);
  };

  if (loading) return <Loader />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Selecciona el evento activo</Text>

      <CustomButton label={`Mes actual: ${mes}`} onPress={() => setShowDatePicker(true)} />

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChangeDate}
        />
      )}

      {eventos.length === 0 ? (
        <EmptyState message="No hay eventos disponibles para este mes." />
      ) : (
        <Picker
          selectedValue={conferencista}
          onValueChange={setConferencista}
          style={[styles.picker, { color: colors.text, backgroundColor: colors.card }]}
          dropdownIconColor={colors.text}
        >
          {eventos.map((evento, i) => (
            <Picker.Item key={i} label={evento.Conferencista} value={evento.Conferencista} />
          ))}
        </Picker>
      )}

      <CustomButton label="Continuar" onPress={continuar} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  picker: {
    borderRadius: 6,
    marginBottom: 30,
  },
  button: {
    marginTop: 10,
  },
});
